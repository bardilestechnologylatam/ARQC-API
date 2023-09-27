const schemasFunction = {}

// validacion del esquemas
schemasFunction.validateFields = (data, schema) => {
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

module.exports = schemasFunction;