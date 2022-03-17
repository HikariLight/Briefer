import { tokenizeSentences, tokenizeWords } from "./tokenization.js";
import { scoreSentences, scoreWords } from "./scoring.js";
import { filterSentence, filterText } from "./filters.js";
import { aggregatePageText, aggregateSectionText, getAverageWeight } from "./processing.js";
import { getWordsMap, getUniversalWordsMap, getSentenceMap } from "./mapping.js";
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

const summarise = (contentList, language, mode) =>{

    // Input: Array representing the page
    // Output: Same array with the paragraph text summarised

    checkObjectInput(contentList, "contentList", "summariser.js", "summarise()");
    checkStringInput(language, "language", "summariser.js", "summarise()");
    checkStringInput(mode, "mode", "summariser.js", "summarise()");

    let result = contentList;
    let text;
    let wordTokens;
    let sentenceTokens;
    let wordsMap;
    let sentencesMap;
    let threshold;

    if(mode == "weak"){

        try{
            for(let i = 0; i < result.length; i++){
                if(paragraphExists(result[i])){

                    text = aggregateSectionText(result[i]);
                    wordTokens = tokenizeWords(text);
                    wordTokens = filterText(wordTokens, language);
                    wordsMap = getWordsMap(wordTokens);
                    scoreWords(wordsMap);

                    for(let j = 0; j < result[i].length; j++){
                        if(result[i][j][0] == "p"){

                            let paragraph = result[i][j][1].join(" ");

                            sentenceTokens = tokenizeSentences(paragraph);
                            sentencesMap = getSentenceMap(sentenceTokens);
                            scoreSentences(sentencesMap, wordsMap);

                            threshold = getAverageWeight(sentencesMap);

                            let sentences = Object.keys(sentencesMap);
                            let summarisedParagraph = [sentences[0]];

                            for(let k = 1; k < sentences.length; k++){
                                if(sentencesMap[sentences[k]] >= threshold){
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
    
    else if(mode == "medium"){
        // Universal threshold. Keeping all sections.
    } 
    
    else if(mode == "strong"){
        // Universal threshold. Keeping major sections.
    } 
    
    else if(mode == "extreme"){
        // // Universal threshold. Keeping no sections.
    }

    return result;
}

export { summarise };