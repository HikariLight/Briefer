const aggregateText = (contentObjList) => {

    // Aggregates the entire text of the page into a string.
    // Needed mostly for getUniversalWordsMap()
    
    if(contentObjList == [] || contentObjList == null){
        throw "Summariser Error:\naggregateText() error. Empty input.";
    }

    if(typeof(contentObjList) != "object"){
        throw "Summariser Error:\naggregateText() error. Wrong input type.\nInput type given: " + typeof(contentObjList);
    }

    let result = [];
    
    for(let section of contentObjList){
        if(section["p"] !== undefined){
            for(let p of section["p"]){
                result.push(p);
            }
        }
    }

    return result.join(" ");
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
