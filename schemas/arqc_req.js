// esquema del json a recibir
const schema = {
    APL: {
        length_data: 3,
    },
    PCOM: {
        length_data: 7,
    },
    PPAN: {
        length_data: 7,
    },
    PPSN: {
        length_data: 7,
    },
    PATC: {
        length_data: 7,
    },
    PUN: {
        length_data: 7,
    },
    PDATOS: {
        length_data: 7,
    },
    PVKI: {
        length_data: 7,
    }
};

const schemaTest = {
    PARAM1: {
      length_data: 3,
    },
    PARAM2: {
        length_data: 9,
        optional_length: 12
    },
};

module.exports = schemaTest;