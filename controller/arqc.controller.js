const { Connection, CommandCall, ProgramCall } = require('itoolkit');
const { XMLParser } = require('fast-xml-parser');

arqc_obj = {}


const conn = new Connection({
    transport: 'idb', // concepto - no operativo
    transportOptions: { 
        host: process.env.HOST_ARQC || 'dafault' , 
        username: process.env.USER_ARQC || 'dafault' , 
        password: process.env.PWD_ARQC || 'dafault' 
    },
});

arqc_obj.get_arqc = async (req, res)=>{
    const { body } = req;

    // Validar los campos
    const errors = validateFields(body, validationSchema);
    if (errors === null) {
        return res.status(400).json({ errors });
    }

    // Se define la aplicacion a consumir
    const program = new ProgramCall(process.env,VALID_PROGRAM, {
        lib: ''
    })
    program.addParam({type: '',value:'' })
    conn.add(program);

    conn.run((error, xmlOutput) => {
    if (error) {
        throw error;
    }

    const Parser = new XMLParser();
    const result = Parser.parse(result);

    console.log(JSON.stringify(result));
    });



    // Linea de comando IBM AS/400
    const command = new CommandCall({ type: 'cl', command: 'RTVJOBA USRLIBL(?) SYSLIBL(?)' });
    conn.add(command);
    conn.run((error, xmlOutput) => {
    if (error) {
        throw error;
    }

    const Parser = new XMLParser();
    const result = Parser.parse(xmlOutput);

    console.log(JSON.stringify(result));
    });
   
    res.json({ 'ARCQ': JSON.stringify(result) });
}


// Función para validar los campos según el JSON recibido en el payload

// esquema del json a recibir
const validationSchema = {
    data: {
      required: true,
      minLength: 5,
      maxLength: 5,
    },
    data1: {
        required: true,
        min: 100000,
        max: 999999,
        integer: true,
    }
};

const validateFields = (data, schema) => {

    let errors = []

    for (const field in schema) {
      if (schema.hasOwnProperty(field)) {
        const fieldSchema = schema[field];
        const value = data[field];
  
        if (!value || value =='') {
            errors.push(`${field} - parametro requerido.`); 
        }
  
        // if (fieldSchema.email && !isValidEmail(value)) {
        //   return `${field} debe ser una dirección de correo electrónico válida.`;
        // }
  
        // if (fieldSchema.integer && !Number.isInteger(value)) {
        //   return `${field} debe ser un número entero.`;
        // }
  
        // if (fieldSchema.min !== undefined && value < fieldSchema.min) {
        //   return `${field} debe ser mayor o igual a ${fieldSchema.min}.`;
        // }
  
        // if (fieldSchema.max !== undefined && value > fieldSchema.max) {
        //   return `${field} debe ser menor o igual a ${fieldSchema.max}.`;
        // }
      }
    }
  
    return null; // Retorna null si no se encuentran errores
};

module.exports = arqc_obj;