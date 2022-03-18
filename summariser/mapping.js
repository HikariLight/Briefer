import { checkObjectInput } from "../exceptionHandling.js";

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

export { getWordsMap, getSentenceMap }