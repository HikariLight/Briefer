import { tokenizeWords } from "./tokenization.js";
import { punctuationFilter } from "./filters.js";
import { getMostFrequent } from "./processing.js";

const scoreWords = (wordsMap) =>{

    // Replaces word occurences with their weights in wordsMap

    let mostFrequent = getMostFrequent(wordsMap);

    for(let word in wordsMap){
        wordsMap[word] /= mostFrequent[1];
    }

}

const scoreSentence = (sentence, wordsMap) =>{
    
    // Calculates the score of a single sentence.

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

    for(let sentence in sentenceMap){
        sentenceMap[sentence] = scoreSentence(sentence, wordsMap);
    }
}

export { scoreWords, scoreSentences }