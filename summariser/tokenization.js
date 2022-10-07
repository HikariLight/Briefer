import {checkStringInput} from "../exceptionHandling.js";
import { preSentenceTokenization, sentenceFiltering } from "./processing.js";

const tokenizeWords = (text) => {

    // Returns an array of all words in a given string

    checkStringInput(text, "text", "tokenization.js", "tokenizeWords()");

    return text.replaceAll("-", " ").split(" ").filter(word => word.length > 0);
}

const tokenizeSentences = (text) =>{

    // Returns a list of all the sentences.
    
    checkStringInput(text, "text", "tokenization.js", "tokenizeSentences()")

    let result = preSentenceTokenization(text);
    result = sentenceFiltering(result.split(". "));

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