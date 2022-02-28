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

    for(let sentence in sentencesMap){
        if(sentencesMap[sentence] >= averageWeight){
            result.push(sentence);
        }
    }

    return result;
}

const extract = (contentObjList, language) =>{

    // Deep copy
    let result = JSON.parse(JSON.stringify(contentObjList));

    let wordsMap = getUniversalWordsMap(result, language);
    for(let i = 0; i < result.length; i++){
        if (result[i]["p"] !== undefined) {
            result[i]["p"] = summarise(result[i]["p"], wordsMap);
        }
    }

    return result;
}

export { extract };