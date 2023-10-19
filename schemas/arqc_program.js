const schemaProgram = {
    "APL":{
        value: "ATM",
    },
    "PCOM":{
        value: "EMVARQC   "
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
        init: 1,
        end: 12
    },
    "RQAOT": {
        param_arqc: "9F03",
        init: 13,
        end: 24
    },
    "RQTCO": {
        param_arqc: "9F1A",
        init: 25,
        end: 28
    },
    "RQTVR": {
        param_arqc: "95",
        init: 29,
        end: 38
    },
    "RQTCU": {
        param_arqc: "5F2A",
        init: 39,
        end: 42
    },
    "RQTDA": {
        param_arqc: "9A",
        init: 43,
        end: 48
    },
    "RQTTY": {
        param_arqc: "9C",
        init: 49,
        end: 50
    },
    "RQUNN": {
        param_arqc: "9F37",
        init: 51,
        end: 58
    },
    "RQAIP": {
        param_arqc: "82",
        init: 59,
        end: 62
    },
    "RQATC": {
        param_arqc: "9F36",
        init: 63,
        end: 66
    },
    
    "RQCMM":{
        param_arqc: "9F10",
        init:67,
        end: 78
    }, 
    // FIN PDATOS
    "PVKI":{
        init:304,
        end:304,
        value: "0"
    },
    "blank":{
        blank_space: 649
    },
    "PCVN":{
        value: "12", // por ahora valor fijo
        param_arqc: "9F10",
        init:954,
        end:955
    }
        
};

module.exports = schemaProgram;
