import {checkStringInput, checkObjectInput} from "../exceptionHandling.js";
import { notMeaningeful, sentenceStarters } from "./filterLists.js";

const punctuationFilter = (wordTokens) => {

    checkObjectInput(wordTokens, "wordTokens", "filters.js", "punctuationFilter()")

    for(let i = wordTokens.length - 1; i >= 0 ; i--){
        wordTokens[i] = wordTokens[i].replaceAll(/[.,\[\]\/"'#!$%\^&\*;:{}=\-_`~()]/g, "");
    }
}

const filterText = (wordTokens, language) => {

    // Filters text of unwanted words, punctuation and spaces.

    checkObjectInput(wordTokens, "wordTokens", "filters.js", "filterText()")
    checkStringInput(language, "language", "filters.js", "filterText()")

    let result = [];
    let notMeaningful = notMeaningeful[language];
    let word;

    for(let i = 0; i < wordTokens.length; i++){
        word = wordTokens[i].replaceAll(/[.,\[\]\/"'#!$%\^&\*;:{}=\-_`~()]/g, "");

        if(word == ""){
            continue;
        }

        if(notMeaningful.includes(word.toLowerCase())){
            continue;
        }

        result.push(word);
    }

    return result;
}

const filterSentence = (sentence, language) => {
    
    // Input: A sentence in string form.
    // Output: same sentence without the openers.

    checkStringInput(sentence, "sentence", "filters.js", "filterSentence()")
    checkStringInput(language, "language", "filters.js", "filterSentence()")

    let filterList = sentenceStarters[language];
    let result = sentence;

    for(let filter of filterList){
        if(filter == sentence.substring(0, filter.length)){
            result = sentence.replace(filter, "");
            result = result.charAt(0).toUpperCase() + result.slice(1);
        }
    }

    return result;
}

export { punctuationFilter, filterText, filterSentence }