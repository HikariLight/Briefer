import {checkIfNull, checkLength, checkIfString, checkIfObject} from "../exceptionHandling.js";

const tokenizeWords = (text) => {

    // Returns an array of all words in a given string

    checkIfNull(text, "text", "tokenization.js", "tokenizeWords()");
    checkIfString(text, "text", "tokenization.js", "tokenizeWords()");
    checkLength(text, "text", "tokenization.js", "tokenizeWords()");

    return text.replaceAll("-", " ").split(" ");
}

const tokenizeSentences = (text) =>{

    // Returns a list of all the sentences.

    checkIfNull(text, "text", "tokenization.js", "tokenizeSentences()");
    checkIfString(text, "text", "tokenization.js", "tokenizeSentences()");
    checkLength(text, "text", "tokenization.js", "tokenizeSentences()");

    let result = text.split(". ").filter(sentence => sentence.length > 0);

    try{
        for(let i = 0; i < result.length; i++){
            result[i] = tokenizeWords(result[i]);
        }
    } catch(error){
        console.log(error);
    }
    
    return result;
}

export {tokenizeWords, tokenizeSentences}