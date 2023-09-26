//const { Connection, CommandCall, ProgramCall } = require('itoolkit');
//const { XMLParser } = require('fast-xml-parser');

arqc_obj = {}

// Esquema del req a validar
const validationSchema = require('../schemas/arqc_req');
const arqc_functions = require('../functions/arqc.functions') // OBTENER FRANQUICIA 

// const conn = new Connection({
//     transport: 'idb', // concepto - no operativo
//     transportOptions: { 
//         host: process.env.HOST_ARQC || 'dafault' , 
//         username: process.env.USER_ARQC || 'dafault' , 
//         password: process.env.PWD_ARQC || 'dafault' 
//     },
// });

arqc_obj.get_arqc = async (req, res)=>{
    const { body } = req;

    // VALIDACION DEL REQUEST CON EL ESQUEMA PRE CONSUMO DEL APLICATIVO
    const errors = validateFields(body, validationSchema);
    if (errors != null) {
        res.status(400).json({ errors });
    }else{

        // SI ESTAN LOS PARAMETROS VALIDADOS, REALIZAMOS EL CONSUMO DEL PROGRAMA
        res.status(200).json({"Status": " OK "})

        // const program = new ProgramCall(process.env.PROGRAM_ARQC, {
        //     lib: process.env.LIBRARY_ARQC
        // })

        // program.addParam({type: '',value:'' })
        // conn.add(program);

        // conn.run((error, xmlOutput) => {
        // if (error) {
        //     throw error;
        // }

        // const Parser = new XMLParser();
        // const result = Parser.parse(result);

        // console.log(JSON.stringify(result));
        // });
    }
}


// FUNCION PARA VALIDAR EL ESQUEMA CON EL BODY
const validateFields = (data, schema) => {
    let errors = []
    for (const field in schema) {
      if (schema.hasOwnProperty(field)) {
        const fieldSchema = schema[field];
        const value = data[field];
        if (!value || value == '' || value === null || value === undefined ) {
            errors.push(`${field} - parametro requerido.`); 
            console.log(`agregando error ${field}`)
        }else{
            if (fieldSchema.length_data && fieldSchema.length_data != value.toString().length ) {
                errors.push(`${field} debe tener un largo de ${fieldSchema.length_data} `);
            }

            if (fieldSchema.integer && !Number.isInteger(value)) {
                errors.push(`${field} debe ser un número.`);
            }
        }
      }
    }
    
    if (errors.length === 0) {
        return null;
    }

    return errors;

};

module.exports = arqc_obj;