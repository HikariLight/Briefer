import { getWordScoresMap, getSentenceScoresMap } from "./scoring.js";
import { filterSentence } from "./filters.js";
import { aggregateSectionText, getAverageWeight } from "./processing.js";
import { checkStringInput, checkObjectInput } from "../exceptionHandling.js";

const paragraphExists = (section) =>{
    
    let exists = false;

    for(let element of section){
        if(element[0] == "p"){
            return true;
        }
    }

    return exists;
}

const summarise = (contentList, language) =>{

    // Input: Array representing the page, as well as the language as a string.
    // Output: Same array with the paragraph text summarised

    checkObjectInput(contentList, "contentList", "summariser.js", "summarise()");
    checkStringInput(language, "language", "summariser.js", "summarise()");

    let result = [];
    let text;
    let wordsScoresMap;
    let sentenceScoresMap;
    let threshold;

    try{
        for(let i = 0; i < contentList.length; i++){

            result.push(contentList[i])

            if(paragraphExists(result[i])){

                text = aggregateSectionText(result[i]);
                wordsScoresMap = getWordScoresMap(text, language);

                for(let j = 0; j < result[i].length; j++){
                    if(result[i][j][0] == "p"){
                        
                        let paragraph = result[i][j][1].join(" ");
                        sentenceScoresMap = getSentenceScoresMap(paragraph, wordsScoresMap);

                        threshold = getAverageWeight(sentenceScoresMap);

                        let sentences = Object.keys(sentenceScoresMap);
                        let summarisedParagraph = [sentences[0]];

                        for(let k = 1; k < sentences.length; k++){
                            if(sentenceScoresMap[sentences[k]] >= threshold){
                                summarisedParagraph.push(filterSentence(sentences[k], language));
                            }
                        }

                        result[i][j][1] = summarisedParagraph;
                    }
                }
            }
        }
    } catch(error){
        console.log(error);
    }

    return result;
}

export { summarise };