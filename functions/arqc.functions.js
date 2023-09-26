const arqc_functions = {}

arqc_functions.get_franquicia = (tag)=>{

    let franquicias =  {
        "627180" : "CMR REFUNDIDO",
        "499847" : "CMR VISA",
        "548740" : "CMR MASTERCARD",
        "445596" : "CMR VISA PLATINUM",
        "465375" : "CMR VISA SIGNATURE",
        "409152" : "CMR VISA CONTACTLESS",
        "404028" : "CMR PRO",
        "512269" : "MASTERCARD PREMIUM",
        "522468" : "CMR MASTERCARD ELITE",
        "548742" : "MASTERCARD CONTACTLESS"
    }

    if (franquicias.hasOwnProperty(tag)) {
        return franquicias[tag];
    } else {
        return false;
    }
    
}


module.exports = arqc_functions;