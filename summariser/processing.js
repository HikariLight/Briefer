import { checkObjectInput } from "../exceptionHandling.js";
import { tokeninzationEdgeCases } from "./filterLists.js";

const aggregateSectionText = (section) =>{
    
    checkObjectInput(section, "section", "processing.js", "aggregateSectionText()");

    let result = "";
    
    for(let element of section){
        if(element[0] == "p"){
            result += element[1].join(" ") + " ";
        }
    }

    return result;
}

const aggregatePageText = (contentList) => {

    // Aggregates the entire text of the page into a string.
    // Input: Array representing page elements.
    // Output: A string containing all the paragraphs in a page.

    checkObjectInput(contentList, "contentList", "processing.js", "aggregatePageText()")

    let result = "";
    
    for(let section of contentList){
        result += aggregateSectionText(section);
    }

    if(result.length == 0){
        throw {
            name : 'InputError', message : '"contentList doesn\'t have any paragraphs', fileName : 'processing.js', functionName : 'aggregatePageText()'
        }
    }

    return result;
}

const preSentenceTokenization = (text) =>{

    tokeninzationEdgeCases.forEach(edgeCase => text = text.replaceAll(edgeCase, "$1"));

    return text
        .replaceAll(/( ([A-Z]|[a-z]){1,2})\./g, "$1")
        .replaceAll(/([0-9])\.([0-9])/g, "$1$2")
        .replaceAll(".\"", "\".") // In American English, the period comes before the end quotation mark.
        .replaceAll(".)", ").");
}

const sentenceFiltering = (sentences) => {

    return sentences
                .filter(sentence => sentence.length > 0)
                .filter(sentence => sentence != "\n");
}

const getMostFrequent = (tokenizedWords) =>{

    // Returns the most frequent word and its number of occurences.

    checkObjectInput(tokenizedWords, "tokenizedWords", "processing.js", "getMostFrequent()")

    let maxOccurence = 0;
    let frequentWord = "";

    for(let word in tokenizedWords){
        if(tokenizedWords[word] > maxOccurence){
            maxOccurence = tokenizedWords[word];
            frequentWord = word;
        }
    }

    return [frequentWord, maxOccurence];
}

const getAverageWeight = (sentenceMap) =>{

    // Returns the average sentence weight so we can use it as a threshhold in summarisation.

    checkObjectInput(sentenceMap, "sentenceMap", "processing.js", "getAverageWeight()")

    let result = 0;
    let length = Object.keys(sentenceMap).length;

    for(let i = 0; i < length; i++){
        result += Object.values(sentenceMap)[i];
    }

    return result / length;
}

export { preSentenceTokenization, sentenceFiltering ,aggregateSectionText, aggregatePageText, getMostFrequent, getAverageWeight }