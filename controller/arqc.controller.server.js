const { Connection, ProgramCall, CommandCall } = require('itoolkit');
const { XMLParser } = require('fast-xml-parser');

arqc_obj = {}

// Esquema del req a validar
const schemas_arqc = require('../schemas/arqc_program');
const schemas_payload = require('../schemas/arqc_req');
const schemas_function = require('../functions/schemas.functions') // validaciones del esquema con el payload

const arqc_functions = require('../functions/arqc.functions') // OBTENER FRANQUICIA 


const add_space = (qty_characters, data_param_arqc) =>{
    if (qty_characters == data_param_arqc.length){
        return data_param_arqc
    }else{
        let aux = data_param_arqc
        qty_spaces_add = qty_characters - data_param_arqc.length
        //console.log(qty_spaces_add)
        if(qty_spaces_add > 0){
            //console.log("paso a for")
            data_param_arqc += " ".repeat(qty_spaces_add)
        }
        
        return data_param_arqc
    }
}

arqc_obj.get_arqc = async (req, res)=>{
    const { body } = req;

    // VALIDACION DEL REQUEST/PAYLOAD CON EL ESQUEMA - PRE CONSUMO DEL APLICATIVO
    const errors = schemas_function.validateFields(body, schemas_payload);
    if (errors != null) {
        res.status(400).json({ errors });
    }else{
        // SI ESTAN LOS PARAMETROS VALIDADOS, REALIZAMOS EL CONSUMO DEL PROGRAMA
        // VALIDACION DE LA FRANQUICIA - SI ES MASTERCARD SEGUN EL TAG 5A


        try{
            if (await arqc_functions.get_franquicia(body["5A"].substring(0, 6)) != null ){
                // OBTENEMOS EL VALOR DE LA FRANQUICIA PARA VALIDAR SI ES MASTERCARD
                franquicia = arqc_functions.get_franquicia(body["5A"].substring(0, 6))
                franquicia_validada = arqc_functions.is_mastercard(franquicia)
                if (franquicia_validada){
                    // si los campos son validos...
                    try{
                        // const conn = new Connection({
                        //     transport: 'ssh', 
                        //     transportOptions: { 
                        //         host: process.env.HOST_ARQC || 'default' , 
                        //         username: process.env.USER_ARQC || 'default' , 
                        //         password: process.env.PWD_ARQC || 'default' 
                        //     },
                        // });
                        
                        // const program = new ProgramCall(process.env.PROGRAM_ARQC, {
                        //     lib: process.env.LIBRARY_ARQC
                        // })

                        // const command = new CommandCall({ type: 'cl', command: 'CHGLIBL LIBL(AXSWQACL AZLOSWQACL AZCOSWQA AZBASWQA AZML2931 QGPL QTEMP MIMIX)  ' })

                        /*
                        for (const tag in schemas_payload) {
                            if (schemas_payload.hasOwnProperty(tag)) {
                                const tag_value = body[tag];
                                console.log(`Tag: ${tag}, Campo param_arqc: ${tag_value}`);
                                program.addParam({type: tag ,value:tag_value })
                            }
                        }
                        
                        */
                       
                       let params = ""

                       for (const param in schemas_arqc){
                            console.log(param)
                            if (schemas_arqc[param].hasOwnProperty("value")) {
                                //console.log("pasoo", schemas_arqc[param]["value"])
                                params += schemas_arqc[param]["value"]
                                console.log("Hasta " + param + params.length )

                            }else if (schemas_arqc[param].hasOwnProperty("blank_space")) {
                                params += " ".repeat(schemas_arqc[param]["blank_space"]);
                                console.log("Hasta " + param + params.length )

                            }else{
                                if (param == "RQCMM"){ // finaliza pdatos
                                    let value_param = body["9F10"]
                                    let value_parse_param = value_param.slice(4, 12)
                                    console.log(value_parse_param)
                                    params += value_parse_param
                                    let qty_blank_space_add = ( 301 - params.length)  + 2
                                    params += " ".repeat(qty_blank_space_add);
                                    console.log("Hasta PDATOS " + params.length )
                                }else{
                                    param_arqc = schemas_arqc[param]["param_arqc"]
                                    min = schemas_arqc[param]["init"]
                                    max = schemas_arqc[param]["end"]
                                    cnt_caracteres = (max - min) + 1
                                    params += add_space(cnt_caracteres, body[param_arqc] )
                                    console.log("Hasta " + param + " " + params.length )
                                }
                            }
                       }

                       let max_length_pgm = 1024
                       let qty_blank_space_end = max_length_pgm - params.length
                       params += " ".repeat(qty_blank_space_end);

                        program.addParam({type: "1024A", value: params , io:"both" })
                      
                        // // llamada del programa
                        conn.add(program);
                        conn.debug(true);
                        
                        conn.run((error, xmlOutput) => {
                            if (error) {
                              console.log("error: ", error)
                              res.json({"status": error})
                              return error;
                            }
                           
                            const Parser = new XMLParser();
                            const result = Parser.parse(xmlOutput);
                            console.log(result);
                            //var respu = JSON.parse(JSON.stringify(result.myscript.pgm.error[0]));
                            // var pin = respu[0].data + "";
                            //console.log(respu)
                            res.json({"status": "Ok"})
                        });
   
                    }catch (error){
                        console.log(error)
                        res.status(200).json({"Status": "Error conexion HOST","Errores": error})
                    }
                }else{
                    res.status(200).json({"Status": "Franquicia no es mastercard"})
                }
            }else{
                res.status(200).json({"Status": "Franquicia no se ha encontrado"})
            }
        }catch (error) {
            res.json({error})
        }
    }
}

module.exports = arqc_obj;