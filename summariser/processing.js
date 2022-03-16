import { checkStringInput, checkObjectInput} from "../exceptionHandling.js";

const aggregateText = (contentList) => {

    // Aggregates the entire text of the page into a string. Needed mostly for getUniversalWordsMap()
    // Input: Array representing page elements.
    // Output: A string containing all the paragraphs in a page.

    checkObjectInput(contentList, "contentList", "processing.js", "aggregateText()")

    let result = "";
    
    for(let section of contentList){
        for(let element of section){
            if(element[0] == "p"){
                result += element[1].join(" ") + " ";
            }
        }
    }

    if(result.length == 0){
        throw {
            name : 'InputError', message : '"contentList doesn\'t have any paragraphs', fileName : 'processing.js', functionName : 'aggregateText()'
        }
    }

    return result;
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

export { aggregateText, getMostFrequent, getAverageWeight }