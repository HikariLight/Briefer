import { tokenizeSentences } from "./tokenization.js";
import { scoreSentences } from "./scoring.js";
import { getAverageWeight } from "./processing.js";
import { getUniversalWordsMap, getSentenceMap } from "./mapping.js";

const summarise = (paragraphList, wordsMap) =>{

    // Returns an array that represents the summary of the input text.

    let result = [];
    let text = paragraphList.join(" ");
    
    let sentenceTokens = [];
    try{
        sentenceTokens = tokenizeSentences(text);
    }catch(error){
        console.log(error);
    }

    let sentencesMap = getSentenceMap(sentenceTokens);
    scoreSentences(sentencesMap, wordsMap);
    let averageWeight = getAverageWeight(sentencesMap)
    
    let sentences = Object.keys(sentencesMap);
    result.push(sentences[0]);

    for(let i = 1; i < sentences.length; i++){
        if(sentencesMap[sentences[i]] >= averageWeight){
            result.push(sentences[i]);
        }
    }

    return result;
}

const extract = (contentObjList, language) =>{

    let result = [];
    let wordsMap = getUniversalWordsMap(result, language);
    
    for(let i = 0; i < contentObjList.length; i++){
        result.push(contentObjList[i]);
        if (result[i]["p"] !== undefined) {
            result[i]["p"] = summarise(result[i]["p"], wordsMap);
        }
    }

    return result;
}

export { extract };