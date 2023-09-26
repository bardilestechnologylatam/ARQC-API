// esquema del json a recibir
const schema = {
    APL: {
        tag: "ATM",
        length_data: 3
    },
    PCOM: {
        tag: "EMVARQC",
        length_data: 3,
    },
    PPAN: {
        tag: "5A",
        length_data: 16,
    },
    PPSN: {
        tag: "5F34",
        length_data: 2,
    },
    PATC: {
        tag: "9F36",
        length_data: 4,
    },
    PUN: {
        tag: "9F37",
        length_data: 8,
    },
    PVKI: {
        tag: "0",
        length_data: 1,
    },
    //// PARA PDATOS
    RQAAU: {
        tag: "9F02",
        length_data: 12,
        integer: true
    },
    RQAOT: {
        tag: "9F03",
        length_data: 12,
        integer: true
    },
    RQTCO: {
        tag: "9F1A",
        length_data: 3,
    },
    RQTVR: {
        tag: "95",
        length_data: 10,
    },
    RQTCU: {
        tag: "5F2A",
        length_data: 3,
    },
    RQTDA: {
        tag: "9A",
        length_data: 6,
    },
    RQTTY: {
        tag: "9C",
        length_data: 2,
    },
    RQUNN: {
        tag: "9F37",
        length_data: 8,
    },
    RQAIP: {
        tag: "82",
        length_data: 4,
    },
    FFFF:{
        tag: "9F10",
        length_data: 12,
        optional_length: 9.
    }

    //  si es que podemos determinar la franquisia... se elimina del esquema ->.
    // RQATC: {
    //     tag: "",
    //     length_data: 7,
    // },
    // RQCMM: {
    //     tag: "",
    //     length_data: 7,
    // },
    // RQMPR: {
    //     tag: "",
    //     length_data: 7,
    //},
};

module.exports = schema;