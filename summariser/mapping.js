import { aggregateText } from "./processing.js";
import { tokenizeWords } from "./tokenization.js";
import { filterText } from "./filters.js";
import { scoreWords } from "./scoring.js"
import { checkStringInput, checkObjectInput } from "../exceptionHandling.js";

const getWordsMap = (tokenizedWords) =>{
    
    // Returns a map of words and their occurences.

    checkObjectInput(tokenizedWords, "tokenizedWords", "mapping.js", "getWordsMap()");

    let wordsMap = {}

    for(let i = 0; i < tokenizedWords.length; i++){
        if(Object.keys(wordsMap).includes(tokenizedWords[i])){
            wordsMap[tokenizedWords[i]] += 1;
        }
        else{
            wordsMap[tokenizedWords[i]] = 1;
        }
    }

    return wordsMap;
}

const getUniversalWordsMap = (contentList, language) => {

    checkObjectInput(contentList, "contentList", "mapping.js", "getUniversalWordsMap()");
    checkStringInput(language, "language", "mapping.js", "getUniversalWordsMap()");

    // Creates a Words Map using the whole page as input

    let result = {};

    let text = aggregateText(contentList)
    let tokenizedWords;

    try{
        tokenizedWords = tokenizeWords(text);
    } catch(error){
        console.log(error);
    }
    
    tokenizedWords = filterText(tokenizedWords, language);
    result = getWordsMap(tokenizedWords);
    scoreWords(result);

    return result;
}

const getSentenceMap = (sentenceTokens) =>{

    // Returns a dicitonary of sentences and a score initialized at 0.

    checkObjectInput(sentenceTokens, "sentenceTokens", "mapping.js", "getSentenceMap()");

    let sentenceMap = {};

    for(let i = 0; i < sentenceTokens.length; i++){
        let sentence = sentenceTokens[i];
        sentence = sentence.join(" ");
        sentenceMap[sentence] = 0;
    }

    return sentenceMap;
}

export { getWordsMap, getUniversalWordsMap, getSentenceMap }