const aggregateText = (contentList) => {

    // Aggregates the entire text of the page into a string. Needed mostly for getUniversalWordsMap()
    // Input: Array representing page elements.
    // Output: A string containing all the paragraphs in a page.
    
    if(contentList == null || contentList == []){
        throw {
            name : 'EmptyInputError', message : 'contentList is empty', fileName : 'processing.js', functionName : 'aggregateText()'
        }
    }

    if(typeof(contentList) != "object"){
        throw {
            name : 'TypeError', message : '"contentList" is ' + typeof(contentList) +' instead of object', fileName : 'processing.js', functionName : 'aggregateText()'
        }
    }

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

    let result = 0;
    let length = Object.keys(sentenceMap).length;

    for(let i = 0; i < length; i++){
        result += Object.values(sentenceMap)[i];
    }

    return result / length;
}

export { aggregateText, getMostFrequent, getAverageWeight }