import { getWordScoresMap, getSentenceScoresMap } from "./scoring.js";
import { filterSentence } from "./filters.js";
import { aggregatePageText, aggregateSectionText, getAverageWeight } from "./processing.js";
import { checkStringInput, checkObjectInput } from "../exceptionHandling.js";

const paragraphExists = (section) =>{
    
    let exists = false;

    for(let element of section){
        if(element[0] == "p"){
            exists = true;
        }
    }

    return exists;
}

const summarise = (contentList, language, mode="weak") =>{

    // Input: Array representing the page, as well as the language as a string.
    // Output: Same array with the paragraph text summarised

    checkObjectInput(contentList, "contentList", "summariser.js", "summarise()");
    checkStringInput(language, "language", "summariser.js", "summarise()");
    checkStringInput(mode, "mode", "summariser.js", "summarise()");

    let result = contentList;
    let text;
    let wordsScoresMap;
    let sentenceScoresMap;
    let threshold;

    if(mode === "weak"){
        try{
            for(let i = 0; i < result.length; i++){
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
    }
    
    // else if(mode == "medium"){
    //     // Universal threshold. Keeping all sections.

    //     text = aggregatePageText(result);
    //     wordsScoresMap = getWordScoresMap(text, language);
    //     threshold = getAverageWeight(sentenceScoresMap);

    // } 
    
    // else if(mode == "strong"){
    //     // Universal threshold. Keeping major sections.

    //     text = aggregatePageText(result);
    //     wordsScoresMap = getWordScoresMap(text, language);
    //     threshold = getAverageWeight(sentenceScoresMap);
    // } 
    
    else if(mode == "extreme"){

        // Universal threshold. Keeping no sections.

        try{
            text = aggregatePageText(result);
            wordsScoresMap = getWordScoresMap(text, language);
            sentenceScoresMap = getSentenceScoresMap(text, wordsScoresMap);
            
            threshold = getAverageWeight(sentenceScoresMap);
    
            let sentences = Object.keys(sentenceScoresMap);
            let summarisedParagraph = [];
    
            for(let k = 0; k < sentences.length; k++){
                if(sentenceScoresMap[sentences[k]] >= threshold){
                    summarisedParagraph.push(filterSentence(sentences[k], language));
                }
            }
    
            result = [];
            let section = [contentList[0][0], ["p", summarisedParagraph]]
            result.push(section);
        } catch(error){
            console.log(error);
        }
    }

    return result;
}

export { summarise };