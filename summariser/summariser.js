import { tokenizeSentences } from "./tokenization.js";
import { scoreSentences } from "./scoring.js";
import { getAverageWeight } from "./processing.js";
import { getUniversalWordsMap, getSentenceMap } from "./mapping.js";

const summarise = (paragraphList, wordsMap) =>{

    // Returns an array that represents the summary of the input text.

    let result = [];
    let text = paragraphList.join(" ");
    
    let sentenceTokens = [];
    sentenceTokens = tokenizeSentences(text);

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

const extract = (contentList, language) =>{

    let result = [];
    let wordsMap = getUniversalWordsMap(contentList, language);

    // console.log(wordsMap);
    
    for(let i = 0; i < contentList.length; i++){
        result.push(contentList[i]);

        for(let j = 0; j < result[i].length; j++){
            if(result[i][j][0] == "p"){
                result[i][j][1] = summarise(result[i][j][1], wordsMap);
            }
        }
    }

    return result;
}

export { extract };