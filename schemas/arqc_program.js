const schemaProgram = {
    "APL":{
        value: "EMV",
        param_arqc: "APL",
        init: 1,
        end:3 
    },
    "PCOM":{
        value: "EMVARQC",
        param_arqc: "PCOM",
        init:4,
        end:13
    },
    "PPAN": {
        param_arqc: "5A",
        init: 14,
        end: 32
    },
    "PPSN": {
        param_arqc: "5F34",
        init:33,
        end: 35
    },
    "PATC": {
        param_arqc: "9F36",
        init: 36,
        end: 39
    },
    "PUN": {
        param_arqc: "9F37",
        init: 40,
        end: 47
    },
    //// PARA PDATOS
    "RQAAU": {
        param_arqc: "9F02",
        tag: "pdatos",
        init: 1,
        end: 12
    },
    "RQAOT": {
        param_arqc: "9F03",
        tag: "pdatos",
        init: 13,
        end: 24
    },
    "RQTCO": {
        param_arqc: "9F1A",
        tag: "pdatos",
        init: 25,
        end: 28
    },
    "RQTVR": {
        param_arqc: "95",
        tag: "pdatos",
        init: 29,
        end: 38
    },
    "RQTCU": {
        param_arqc: "5F2A",
        tag: "pdatos",
        init: 39,
        end: 42
    },
    "RQTDA": {
        param_arqc: "9A",
        tag: "pdatos",
        init: 43,
        end: 48
    },
    "RQTTY": {
        param_arqc: "9C",
        tag: "pdatos",
        init: 49,
        end: 50
    },
    "RQUNN": {
        param_arqc: "9F37",
        tag: "pdatos",
        init: 51,
        end: 58
    },
    "RQAIP": {
        param_arqc: "82",
        tag: "pdatos",
        init: 59,
        end: 62
    },
    "RQATC": {
        param_arqc: "9F36",
        tag: "pdatos",
        init: 63,
        end: 66
    },
    // FIN PDATOS
    "PVKI":{
        param_arqc: "PVKI",
        init:304,
        end:304,
        value: "0"
    },
    "PCVN":{
        param_arqc: "PCVN",
        value: "",
        init:954,
        end:955,
        calculate: true
    }
        
};

module.exports = schemaProgram;
