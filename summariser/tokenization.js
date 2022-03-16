import {checkStringInput} from "../exceptionHandling.js";

const tokenizeWords = (text) => {

    // Returns an array of all words in a given string

    checkStringInput(text, "text", "tokenization.js", "tokenizeWords()");

    return text.replaceAll("-", " ").split(" ");
}

const tokenizeSentences = (text) =>{

    // Returns a list of all the sentences.
    
    checkStringInput(text, "text", "tokenization.js", "tokenizeSentences()")

    // In American English, the period comes before the end quotation mark.
    let result = text.replaceAll(".\"", "\".").split(". ").filter(sentence => sentence.length > 0);

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