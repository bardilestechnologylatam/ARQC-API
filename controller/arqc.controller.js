//const { Connection, ProgramCall } = require('itoolkit');
//const { XMLParser } = require('fast-xml-parser');

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

        let errors_conexion = []
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
                            transport: 'idb', 
                            transportOptions: { 
                                host: process.env.HOST_ARQC || 'dafault' , 
                                username: process.env.USER_ARQC || 'dafault' , 
                                password: process.env.PWD_ARQC || 'dafault' 
                            },
                        });
                        
                        const program = new ProgramCall(process.env.PROGRAM_ARQC, {
                            lib: process.env.LIBRARY_ARQC
                        })

                        /*
                        for (const tag in schemas_payload) {
                            if (schemas_payload.hasOwnProperty(tag)) {
                                const tag_value = body[tag];
                                console.log(`Tag: ${tag}, Campo param_arqc: ${tag_value}`);
                                program.addParam({type: tag ,value:tag_value })
                            }
                        }
                        conn.add(program);
                        */

                       let APL = "ATM"
                       let PCOM = "EMVARQC"
                       let PPAN = "5122695026122100"
                       let PPSN = "00"
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
                       let RQCMM = "0110A00001220000000000000000000000FF"
                       let RQMPR = "0110A00001220000000000000000000000FF"

                       PDATOS = RQAAU + RQAOT + RQTCO + RQTVR + RQTCU + RQTDA + RQTTY + RQUNN + RQAIP + RQATC + RQCMM + RQMPR

                       program.addParam({type: "APL" ,value: APL })
                       program.addParam({type: "PCOM" ,value :PCOM })
                       program.addParam({type: "PPAN" ,value: PPAN })
                       program.addParam({type: "PPSN" ,value: PPSN })
                       program.addParam({type: "PATC" ,value: PATC })
                       program.addParam({type: "PUN" ,value: PUN })
                       program.addParam({type: "PDATOS" ,value: PDATOS })
                       program.addParam({type: "PVKI" ,value: PVKI })
                       program.addParam({type: "PCVN" ,value: PCVN })
                       
                       /*
                    
                       program.addParam({type: "RQAAU" ,value: RQAAU })
                       program.addParam({type: "RQAOT" ,value :RQAOT })
                       program.addParam({type: "RQTCO" ,value: RQTCO })
                       program.addParam({type: "RQTVR" ,value: RQTVR })
                       program.addParam({type: "RQTCU" ,value: RQTCU })
                       program.addParam({type: "RQTDA" ,value: RQTDA })
                       program.addParam({type: "RQTTY" ,value: RQTTY })
                       program.addParam({type: "RQUNN" ,value: RQUNN })
                       program.addParam({type: "RQAIP" ,value: RQAIP })
                       program.addParam({type: "RQATC" ,value: RQATC })
                       program.addParam({type: "RQCMM" ,value: RQCMM })
                       program.addParam({type: "RQMPR" ,value: RQMPR })

                       */

                        // llamada del programa
                        conn.run((error, xmlOutput) => {
                            if (error) {
                              console.log("error: ", error)
                              errors_conexion.append(error)
                              throw error;
                            }
                            const Parser = new XMLParser();
                            const result = Parser.parse(result);
                            console.log(JSON.stringify(result));
                            res.json(JSON.stringify(result))
                        });
                        
                    }catch (error){
                        errors_conexion.append(error)
                        res.status(200).json({"Status": "Error conexion HOST","Errores": errors_conexion})
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