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
                        
                        for (const tag in schemas_payload) {
                            if (schemas_payload.hasOwnProperty(tag)) {
                                const tag_value = body[tag];
                                console.log(`Tag: ${tag}, Campo param_arqc: ${tag_value}`);
                                program.addParam({type: tag ,value:tag_value })
                            }
                        }
                        
                        console.log(program)
                        conn.add(program);

                        conn.run((error, xmlOutput) => {
                            if (error) {
                              console.log("error: ", error)
                              throw error;
                            }
                            const Parser = new XMLParser();
                            const result = Parser.parse(result);
                            console.log(JSON.stringify(result));

                            res.json(JSON.stringify(result))
                        });

                    }catch (error){
                        console.log(error)
                        res.status(200).json({"Status": "Error conexion HOST","Error": error})
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