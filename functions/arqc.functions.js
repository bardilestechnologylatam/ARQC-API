const arqc_functions = {}

const franquicias =  {
    "627180" : "CMR REFUNDIDO",
    "499847" : "CMR VISA",
    "548740" : "CMR MASTERCARD",
    "445596" : "CMR VISA PLATINUM",
    "465375" : "CMR VISA SIGNATURE",
    "409152" : "CMR VISA CONTACTLESS",
    "404028" : "CMR PRO",
    "512269" : "MASTERCARD PREMIUM",
    "522468" : "CMR MASTERCARD ELITE",
    "548742" : "MASTERCARD CONTACTLESS",
    "409767" : "VISA TRADICIONAL"
}

arqc_functions.get_franquicia = (tag) =>{ //5A
    if (franquicias.hasOwnProperty(tag)) {
        return franquicias[tag];
    } else {
        return null;
    }   
}

arqc_functions.is_mastercard = (franquicia) => {
    if (franquicia.includes("MASTERCARD")) {
        return true
    } else {
        return false
    }   
}

arqc_functions.is_visa = (franquicia) => {
    if (franquicia.includes("VISA")) {
        return true
    } else {
        return false
    }   
}

module.exports = arqc_functions;