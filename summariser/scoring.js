import { tokenizeWords } from "./tokenization.js";
import { getWordsMap, getSentenceMap } from "./mapping.js";
import { punctuationFilter } from "./filters.js";
import { getMostFrequent } from "./processing.js";
import { checkStringInput, checkObjectInput } from "../exceptionHandling.js";

const getWordScoresMap = (text, language) =>{

    // Input: text and mode as strings.
    // Output: Dictionary that has words and their scores.
    
    checkStringInput(text, "text", "scoring.js", "getWordScoresMap()");
    checkStringInput(language, "language", "scoring.js", "getWordScoresMap()");

    let getWordScoresMap = {};

    try{
        getWordScoresMap = getWordsMap(text, language);
        let mostFrequent = getMostFrequent(getWordScoresMap);

        for(let word in getWordScoresMap){
            getWordScoresMap[word] /= mostFrequent[1];

            // Giving capitalized words 50% higher score.
            if(word[0] === word[0].toUpperCase()){
                getWordScoresMap[word] += getWordScoresMap[word] * 0.5;
            }
        }
    } catch(error){
        console.log(error);
    }

    return getWordScoresMap;
}

const scoreSentence = (sentence, wordsMap) =>{
    
    // Calculates the score of a single sentence.

    checkStringInput(sentence, "sentence", "scoring.js", "scoreSentence()");
    checkObjectInput(wordsMap, "wordsMap", "scoring.js", "scoreSentence()");

    let score = 0;
    let sentenceTokens;

    try{
        sentenceTokens = tokenizeWords(sentence);
    } catch(error){
        console.log(error);
    }

    punctuationFilter(sentenceTokens);

    for(let i = 0; i < sentenceTokens.length; i++){
        if(Object.keys(wordsMap).includes(sentenceTokens[i])){
            score += wordsMap[sentenceTokens[i]];
        }
    }

    return score;
}

const getSentenceScoresMap = (text, wordsMap) =>{
    
    // Returns a dictionary of sentences and their weights.

    checkStringInput(text, "text", "scoring.js", "getSentenceScoresMap()");
    checkObjectInput(wordsMap, "wordsMap", "scoring.js", "getSentenceScoresMap()");

    let getSentenceScoresMap = getSentenceMap(text);

    for(let sentence in getSentenceScoresMap){
        getSentenceScoresMap[sentence] = scoreSentence(sentence, wordsMap);
    }

    return getSentenceScoresMap;
}

export { getWordScoresMap, getSentenceScoresMap }