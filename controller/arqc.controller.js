const { Connection, ProgramCall, CommandCall } = require('itoolkit');
const { XMLParser } = require('fast-xml-parser');

arqc_obj = {}

// Esquema del req a validar
const schemas_arqc = require('../schemas/arqc_program');
const schemas_payload = require('../schemas/arqc_req');
const schemas_function = require('../functions/schemas.functions') // validaciones del esquema con el payload
const arqc_functions = require('../functions/arqc.functions') // OBTENER FRANQUICIA 

const add_space = (qty_characters, data_param_arqc) => {
    if (qty_characters == data_param_arqc.length) {
        //console.log(data_param_arqc)
        return data_param_arqc
    } else {
        qty_spaces_add = qty_characters - data_param_arqc.length
        //console.log(qty_spaces_add)
        if (qty_spaces_add > 0) {
            //console.log(data_param_arqc)
            data_param_arqc += " ".repeat(qty_spaces_add)
        }
        return data_param_arqc
    }
}


arqc_obj.get_arqc = async (req, res) => {
    const { body } = req;

    // VALIDACION DEL REQUEST/PAYLOAD CON EL ESQUEMA - PRE CONSUMO DEL APLICATIVO
    const errors = schemas_function.validateFields(body, schemas_payload);
    if (errors != null) {
        res.status(400).json({ "Status" : "Error de parametros", errors });
    } else {
        // SI ESTAN LOS PARAMETROS VALIDADOS, REALIZAMOS EL CONSUMO DEL PROGRAMA
        // VALIDACION DE LA FRANQUICIA - SI ES MASTERCARD SEGUN EL TAG 5A

        if (await arqc_functions.get_franquicia(body["5A"].substring(0, 6)) != null) {
            // OBTENEMOS EL VALOR DE LA FRANQUICIA PARA VALIDAR SI ES MASTERCARD
            franquicia = arqc_functions.get_franquicia(body["5A"].substring(0, 6))

            if (franquicia != null) {
                // FRANQUICIA VALIDADA

                if (body["9F10"].length == "14" || body["9F10"].length == "36") {
                    const new_9f10 = (body["9F10"].length == "14") ? body["9F10"] : body["9F10"].substring(4, 16)
                    const old_card = (body["9F10"].length == "14") ? true : false // almacenamos si la tarjeta es antigua 14 o nueva de 36 caracteres

                    const bin_card = body["5A"].substring(0, 6)
                    const PCVN = (new_9f10.substring(4, 6) === "12" ||  bin_card.includes("533187") ||  bin_card.includes("627180")) ? "12" : "  "
                    console.log("9F10 => " + new_9f10, " PCVN =>" + PCVN)

                    schemas_arqc["PCVN"]["value"] = PCVN
                    //console.log(body["9F10"] + " /n " + PCVN + " /n " + body["9F10"].substring(4, 6))
                    let PLOT_PARAMS = ""
                    let PDATOS = ""
                    let activate_pdatos = false

                    for (const field in schemas_arqc) {
                        let tag_schama = schemas_arqc[field]["param_arqc"]
                        let value_tag = (schemas_arqc[field].hasOwnProperty("value")) ? schemas_arqc[field]["value"] : body[tag_schama]
                        let init_space_string = schemas_arqc[field]["init"]
                        let end_space_string = schemas_arqc[field]["end"]
                        let qty_space_blank = (end_space_string - init_space_string) + 1

                        // agregamos los valores de la segunda trama 
                        if (schemas_arqc[field].hasOwnProperty("tag") && schemas_arqc[field]["tag"] == "pdatos") {
                            activate_pdatos = true // cancelamos el recorrdido de schemas despues del pdatos
                            // RQATC corresponde al ultimo valor no calculado de la cadena, falta calcular el valor RQCMM o RQMPR
                            PDATOS += value_tag
                            
                            if (field == "RQATC") {

                                if (old_card){
                                    if (PCVN == "12" && arqc_functions.is_mastercard(franquicia)) {
                                        console.log("Condicion 1")
                                        PDATOS+= new_9f10.substring(4,12)
    
                                    } else if (PCVN != "12" && arqc_functions.is_visa(franquicia)) {
                                        console.log("Condicion 2")
                                        PDATOS+= new_9f10.substring(6,8)
                                        
                                    } else if (PCVN != "12" && !arqc_functions.is_visa(franquicia)) {
                                        console.log("Condicion 4")
                                        PDATOS+= new_9f10

                                    }else if (PCVN == "12" && arqc_functions.is_visa(franquicia)){
                                        console.log("Condicion 5")
                                        PDATOS+= new_9f10
                                    }

                                }else{
                                    console.log("paso por aqui")
                                    PDATOS += new_9f10
                                }
                            }
                        }

                        if (activate_pdatos != true) {
                            // agregamos los valores de la primera trama 
                            PLOT_PARAMS += add_space(qty_space_blank, value_tag)
                            //console.log("agregando:", value_tag)
                        }
                    }

                    let init_pdatos = 48 //+ PDATOS.length
                    let end_pdatos = 303 // es hasta el 301 pero se le agregan dos espacios en blancos por que PVKI va en el 304
                    console.log(PDATOS.length, (end_pdatos - init_pdatos) + 1)
                    PDATOS = add_space((end_pdatos - init_pdatos) + 1, PDATOS)
                    PLOT_PARAMS += PDATOS
                    console.log(PDATOS)
                    // AGREGANDO ULTIMA TRAMA 
                    //console.log("Agregando trama final")
                    PLOT_PARAMS += schemas_arqc["PVKI"]["value"]

                    // AGREGANDO ESPACIOS DESDE EL 305 AL 953 POR QUE PCVN ES DEL 994 Y 995
                    PLOT_PARAMS += " ".repeat(649)
                    PLOT_PARAMS += PCVN

                    // completar hasta el 1024
                    PLOT_PARAMS += " ".repeat(1024 - 956 + 1)
                    console.log()
                    console.log("String total:" + (PLOT_PARAMS).length)

                    // CONEXION IBM 
                    try {
                        const conn = new Connection({
                            transport: 'ssh',
                            transportOptions: {
                                host: process.env.HOST_ARQC || 'default',
                                username: process.env.USER_ARQC || 'default',
                                password: process.env.PWD_ARQC || 'default'
                            },
                        });

                        const program = new ProgramCall(process.env.PROGRAM_ARQC, {
                            lib: process.env.LIBRARY_ARQC
                        })

                        const command = new CommandCall({ type: 'cl', command: 'CHGLIBL LIBL(AXSWQACL AZLOSWQACL AZCOSWQA AZBASWQA AZML2931 QGPL QTEMP MIMIX)  ' })
                        program.addParam({ type: "1024A", value: PLOT_PARAMS, io: "both" })

                        // // llamada del programa
                        conn.add(command);
                        conn.add(program);
                        conn.debug(true);

                        conn.run((error, xmlOutput) => {
                            if (error) {
                                res.status(400).json({ "Status": error })
                                return error;
                            }

                            try{
                                const Parser = new XMLParser();
                                const result = Parser.parse(xmlOutput);
                                var respu = JSON.parse(JSON.stringify(result.myscript.pgm));
                                res.status(200).json({ "Status": "Ok", "ARQC": respu["parm"]["data"].substring(9,25) })
                            }catch(innerError){
                                res.status(200).json({ "Status": "Error al obtener el ARQC" })
                            }
                            
                        });

                        //res.json({ "status": "Ok", "trama": PLOT_PARAMS })
                    } catch (error) {
                        res.status(400).json({ "Status": "error", error })
                    }
                }else{
                    res.status(400).json({"Status": "ERROR por paramtro 9F10 - largo de la cadena no valida"})
                }
            } else {
                res.status(400).json({ "Status": "Franquicia no encontrada" })
            }
        } else {
            res.status(400).json({ "Status": "Franquicia no se ha encontrado" })
        }
    }
}

module.exports = arqc_obj;