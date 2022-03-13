import { tokenizeSentences } from "./tokenization.js";
import { scoreSentences } from "./scoring.js";
import { getAverageWeight } from "./processing.js";
import { getUniversalWordsMap, getSentenceMap } from "./mapping.js";

const summarise = (text, wordsMap) =>{

    // Input: String of text 
    // Output: An array of sentences that represents the summary of the input text.

    let result = [];
    let sentenceTokens;

    try{
        sentenceTokens = tokenizeSentences(text);
    } catch(error){
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

const extract = (contentList, language) =>{

    // Input: Array of HTML elements.
    // Output: The same input array with the p tags' content replaced with summarised text.

    if(contentList == undefined || contentList.length == 0){
        throw {
            name : 'EmptyInputError', message : '"contentList" is empty', fileName : 'summariser.js', functionName : 'extract()'
        }
    }

    if(language == undefined || language == ""){
        throw {
            name : 'EmptyInputError', message : 'language is empty', fileName : 'summariser.js', functionName : 'extract()'
        }
    }

    let result = [];
    let wordsMap = getUniversalWordsMap(contentList, language);
  

    for(let i = 0; i < contentList.length; i++){
        result.push(contentList[i]);
    
        for(let j = 0; j < result[i].length; j++){
            if(result[i][j][0] === "p"){
                result[i][j][1] = summarise(result[i][j][1].join(" "), wordsMap);
            }
        }
    }

    return result;
}

export { extract };