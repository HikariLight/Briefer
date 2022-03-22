import { checkStringInput } from "../exceptionHandling.js";
import { filterText } from "./filters.js";
import { tokenizeWords, tokenizeSentences } from "./tokenization.js";

const getWordsMap = (text, language) =>{
    
    // Returns a map of words and their occurences.

    checkStringInput(text, "text", "mapping.js", "getWordsMap()");
    checkStringInput(language, "language", "mapping.js", "getWordsMap()");

    let wordTokens = tokenizeWords(text);
    wordTokens = filterText(wordTokens, language);

    let wordsMap = {}

    for(let i = 0; i < wordTokens.length; i++){
        if(Object.keys(wordsMap).includes(wordTokens[i])){
            wordsMap[wordTokens[i]] += 1;
        }
        else{
            wordsMap[wordTokens[i]] = 1;
        }
    }

    return wordsMap;
}

const getSentenceMap = (text) =>{

    // Returns a dicitonary of sentences and a score initialized at 0.

    checkStringInput(text, "text", "mapping.js", "getSentenceMap()");

    let sentenceTokens = tokenizeSentences(text);

    let sentenceMap = {};

    for(let i = 0; i < sentenceTokens.length; i++){
        let sentence = sentenceTokens[i];
        sentence = sentence.join(" ");
        sentenceMap[sentence] = 0;
    }

    return sentenceMap;
}

export { getWordsMap, getSentenceMap }