const tokenizeWords = (text) => {

    // Returns a list of all words in a given string

    if(text.length == 0 ||text == null){
        throw "Summariser Error:\ntokenizeWords() error. Empty input.";
    }

    if(typeof(text) != "string"){
        throw "Summariser Error:\ntokenizeWords() error. Wrong input type.\nInput type given: " + typeof(text);
    }

    return text.replaceAll("-", " ").split(" ");
}

const tokenizeSentences = (text) =>{

    // Returns a list of all the sentences.

    if(text.length == 0 ||text == null){
        throw "Summariser Error:\ntokenizeSentences() error. Empty input.";
    }

    if(typeof(text) != "string"){
        throw "Summariser Error:\ntokenizeSentences() error. Wrong input type.\nInput type given: " + typeof(text);
    }

    let result = text.split(". ");

    for(let i = 0; i < result.length; i++){
        result[i] = tokenizeWords(result[i]);
    }
    
    return result;
}

export {tokenizeWords, tokenizeSentences}