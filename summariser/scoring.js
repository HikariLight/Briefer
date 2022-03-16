import { tokenizeWords } from "./tokenization.js";
import { punctuationFilter } from "./filters.js";
import { getMostFrequent } from "./processing.js";
import { checkStringInput, checkObjectInput } from "../exceptionHandling.js";

const scoreWords = (wordsMap) =>{

    checkObjectInput(wordsMap, "wordsMap", "scoring.js", "scoreWords()");

    // Replaces word occurences with their weights in wordsMap

    let mostFrequent = getMostFrequent(wordsMap);

    for(let word in wordsMap){
        wordsMap[word] /= mostFrequent[1];

        // Giving capitalized words 50% higher score.
        if(word[0] === word[0].toUpperCase()){
            wordsMap[word] += wordsMap[word] * 0.5;
        }
    }
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

const scoreSentences = (sentenceMap, wordsMap) =>{
    
    // Returns a dictionary of sentences and their weights.

    checkObjectInput(sentenceMap, "sentenceMap", "scoring.js", "scoreSentences()");
    checkObjectInput(wordsMap, "wordsMap", "scoring.js", "scoreSentences()");

    for(let sentence in sentenceMap){
        sentenceMap[sentence] = scoreSentence(sentence, wordsMap);
    }
}

export { scoreWords, scoreSentences }