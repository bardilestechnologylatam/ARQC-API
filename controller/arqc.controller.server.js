const { Connection, ProgramCall, CommandCall } = require('itoolkit');
const { XMLParser } = require('fast-xml-parser');



arqc_obj = {}

// Esquema del req a validar
const schemas_payload = require('../schemas/arqc_req');
const schemas_function = require('../functions/schemas.functions') // validaciones del esquema con el payload

const arqc_functions = require('../functions/arqc.functions') // OBTENER FRANQUICIA 
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
                    //res.status(200).json({"Status": "OK"})

                    // si los campos son validos...

                    try{
                        const host = process.env.HOST_ARQC
                        const user = process.env.USER_ARQC
                        const passwd = process.env.PWD_ARQC
                        const programAz = process.env.PROGRAM_ARQC
                        const lib = process.env.LIBRARY_ARQC

                        console.log("//////////////////////////////////////")
                        console.log("verificacion de uso de .ENV")
                        console.log(host, user, passwd, programAz, lib)

                        const conn = new Connection({
                            transport: 'ssh', 
                            transportOptions: { 
                                host: process.env.HOST_ARQC || 'default' , 
                                username: process.env.USER_ARQC || 'default' , 
                                password: process.env.PWD_ARQC || 'default' 
                            },
                        });
                        
                        const program = new ProgramCall(process.env.PROGRAM_ARQC, {
                            lib: process.env.LIBRARY_ARQC
                        })
			const command = new CommandCall({ type: 'cl', command: 'CHGLIBL LIBL(AXSWQACL AZLOSWQACL AZCOSWQA AZBASWQA AZML2931 QGPL QTEMP MIMIX)  ' })

                        /*
                        for (const tag in schemas_payload) {
                            if (schemas_payload.hasOwnProperty(tag)) {
                                const tag_value = body[tag];
                                console.log(`Tag: ${tag}, Campo param_arqc: ${tag_value}`);
                                program.addParam({type: tag ,value:tag_value })
                            }
                        }
                        
                        */

                       let APL = "ATM"
                       let PCOM = "EMVARQC   "
                       let PPAN = "5122695026122100   "
                       let PPSN = "00 "
                       let PATC = "002F"
                       let PUN = "8A7B5A4F"
                       let PDATOS = ""
                       let PVKI = "0"
                       let PCVN = "12"

                       let RQAAU = "000000000000"
                       let RQAOT = "000000000000"
                       let RQTCO = "0152"
                       let RQTVR = "8000048000"
                       let RQTCU = "0152"
                       let RQTDA = "230928"
                       let RQTTY = "01"
                       let RQUNN = "8A7B5A4F"
                       let RQAIP = "3900"
                       let RQATC = "002F"
                       let RQCMM = "A0000122                                                                                                                                                                                    "
                       //let RQMPR = "A0000122000000"

                       PDATOS = RQAAU + RQAOT + RQTCO + RQTVR + RQTCU + RQTDA + RQTTY + RQUNN + RQAIP + RQATC + RQCMM

                      // program.addParam({type: "3A", value: APL, io: "both" })
                      // program.addParam({type: "7A", value: PCOM, io: "both" })
                      // program.addParam({type: "16A", value: PPAN, io: "both" })
                      // program.addParam({type: "2A", value: PPSN, io: "both" })
                      // program.addParam({type: "4A", value: PATC, io: "both" })
                      // program.addParam({type: "8A", value: PUN, io: "both" })
                      // program.addParam({type: "138A", value: PDATOS, io: "both" })
                      // program.addParam({type: "1A", value: PVKI, io: "both" })
                      // program.addParam({type: "2A", value: PCVN, io: "both" })
                       
                        sum_params = APL+PCOM+PPAN+PPSN+PATC+PUN+PDATOS+PVKI+PCVN
                        program.addParam({type: "1024A", value: "ATMEMVARQC   5122695026122100   00 002F8A7B5A4F000000000000000000000000015280000480000152230928018A7B5A4F3900002FA0000122                                                                                                                                                                                      0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         12                                                                     ", io: "both" })
                      
                        // llamada del programa
			conn.add(command);
                        conn.add(program);
                        conn.debug(true);
                        
                        conn.run((error, xmlOutput) => {
                            if (error) {
                              console.log("error: ", error)
                              return error;
                            }
                            const Parser = new XMLParser();
                            const result = Parser.parse(xmlOutput);
				console.log(result);
				//var respu = JSON.parse(JSON.stringify(result.myscript.pgm.error[0]));
				// var pin = respu[0].data + "";
				//console.log(respu)
                        });
                        
                    }catch (error){
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
