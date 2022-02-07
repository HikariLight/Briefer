const getNotMeaningful = (language) => {

    let result = [];

    // 30 Most common words in each language
    if(language == "en"){
        result = ['as', 'i', 'his', 'that', 'he', 'was', 'for', 'on', 'are', 'with', 'they', 'be', 'at', 'one', 'have', 'this', 'from', 'by', 'hot', 'word', 'but', 'what', 'some', 'is', 'it', 'you', 'or', 'had', 'the', 'of'];
    }

    else if(language == "fr"){
        ['comme', 'je', 'son', 'que', 'il', 'était', 'pour', 'sur', 'sont', 'avec', 'ils', 'être', 'à', 'un', 'avoir', 'ce', 'à', 'par', 'chaud', 'mot', 'mais', 'que', 'certains', 'est', 'il', 'vous', 'ou', 'eu', 'la', 'de'];
    }

    else if(language == "de"){
        result = ['wie', 'ich', 'seine', 'dass', 'er', 'war', 'für', 'auf', 'sind', 'mit', 'sie', 'sein', 'bei', 'ein', 'haben', 'dies', 'aus', 'durch', 'heiß', 'Wort', 'aber', 'was', 'einige', 'ist', 'es', 'Sie', 'oder', 'hatte', 'die', 'von'];
    }

    else if(language == "nl"){
        result = ['als', 'i', 'zijn', 'dat', 'hij', 'was', 'voor', 'op', 'zijn', 'met', 'ze', 'zijn', 'bij', 'een', 'hebben', 'deze', 'van', 'door', 'heet', 'woord', 'maar', 'wat', 'sommige', 'is', 'het', 'u', 'of', 'had', 'de', 'van'];
    }

    else if(language == "es"){
        result = ['como', 'i', 'su', 'que', 'él', 'era', 'para', 'en', 'son', 'con', 'ellos', 'ser', 'en', 'uno', 'tener', 'este', 'desde', 'por', 'caliente', 'palabra', 'pero', 'qué', 'algunos', 'es', 'lo', 'usted', 'o', 'tenido', 'la', 'de'];
    }

    else if(language == "it"){
        result = ['come', 'io', 'il', 'che', 'lui', 'era', 'per', 'su', 'sono', 'con', 'essi', 'essere', 'a', 'uno', 'avere', 'questo', 'da', 'da', 'caldo', 'parola', 'ma', 'cosa', 'alcuni', 'è', 'esso', 'voi', 'o', 'aveva', 'il', 'di'];
    }
    
    return result;
}

const filterWord = (word) => {

    // Filters a word out of punctuation

    let result = word;
    let punctuation = [".", ",", "!", "?", ";"];

    if(punctuation.includes(word.at(-1))){
        result = word.slice(0, -1);
    }

    return result;
}

const filterText = (wordTokens, language) => {

    // Filters text of unwanted words, punctuation and spaces.

    let notMeaningful = getNotMeaningful(language);

    for(let i = wordTokens.length - 1; i >= 0 ; i--){
        if(notMeaningful.includes(wordTokens[i].toLowerCase())){
            wordTokens.splice(i, 1);
        }

        else{
            wordTokens[i] = filterWord(wordTokens[i]);
        }
    }
}

const filterSentences = (sentenceTokens, language) =>{

    // Filters sentences out of things that might make the words uncreognisable by the wordsMap.

    for(let i = 0; i < sentenceTokens.length; i++){
        filterText(sentenceTokens[i], language);
    }
}

const tokenizeWords = (text) => {

    // Returns a list of all words in a given string

    return text.split(" ");
}

const tokenizeSentences = (text) =>{

    // Returns a list of all the sentences.

    let result = text.split(".");
    for(let i = 0; i < result.length; i++){
        result[i] = result[i].split(" ");
    }
    return result;
}

const getWordsMap = (tokenizedWords) =>{
    
    // Returns a map of words and their occurences.

    let wordsMap = {}

    for(let i = 0; i < tokenizedWords.length; i++){
        if(Object.keys(wordsMap).includes(tokenizedWords[i])){
            wordsMap[tokenizedWords[i]] += 1;
        }
        else{
            wordsMap[tokenizedWords[i]] = 1;
        }
    }

    return wordsMap;
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

const weighWords = (wordsMap) =>{

    // Replaces word occurences with their weights in wordsMap

    let mostFrequent = getMostFrequent(wordsMap);

    for(let word in wordsMap){
        wordsMap[word] /= mostFrequent[1];
    }

}

const getSentenceMap = (sentenceTokens) =>{

    // Returns a dicitonary of sentences and a score initialized at 0.

    let sentenceMap = {};

    for(let i = 0; i < sentenceTokens.length; i++){
        let sentence = sentenceTokens[i];
        sentence = sentence.join(" ");
        sentenceMap[sentence] = 0;
    }

    return sentenceMap;
}

const scoreSentence = (sentence, wordsMap) =>{
    
    // Calculates the score of a single sentence.

    let score = 0;
    let sentenceTokens = tokenizeWords(sentence);

    for(let i = 0; i < sentenceTokens.length; i++){
        if(Object.keys(wordsMap).includes(sentenceTokens[i])){
            score += wordsMap[sentenceTokens[i]];
        }
    }

    return score;
}

const scoreSentences = (sentenceMap, wordsMap) =>{
    
    // Returns a dictionary of sentences and their weights.

    for(let sentence in sentenceMap){
        sentenceMap[sentence] = scoreSentence(sentence, wordsMap);
    }
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

const summarise = (textList, language) =>{
    
    // Main function. Returns a string that represents the summary of the input text.

    let result = [];
    let text = textList.join(" ");

    let wordTokens = tokenizeWords(text);
    filterText(wordTokens, language);
    let wordsMap = getWordsMap(wordTokens);
    weighWords(wordsMap);

    let sentenceTokens = tokenizeSentences(text);
    filterSentences(sentenceTokens, language);
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

export { summarise };

// // // ======== Tests ========

// let test_text = "The material being used here is one of a class of compounds called perovskite nickelates. Perovskite is a general term for a specific arrangement of atoms in a crystalline structure; a wide variety of chemicals can form perovskites. In this case, the crystal is formed from a material that's a mix of neodymium, nickel, and oxygen. The crystal structure has enough open space that it can readily absorb and hold onto hydrogen. Once the hydrogen is incorporated, its electron will often end up being transferred to one of the nickel atoms. This changes the electrical properties of the atom and, in doing so, changes the conductivity of the material in general. The degree to which they change depends on how much hydrogen is present. Since the hydrogen ends up with a positive charge after giving up its electron, it can be controlled by externally applied electric fields. So, by controlling the electrical environment, it's possible to redistribute the hydrogen within the perovskite structure. That will then change the conductive properties of the material.";

// // // ==== Word Tests ====
// let wordTokens = tokenizeWords(test_text);
// // console.log(wordTokens);

// // Filtering Test:
// // console.log(wordTokens.length);
// filterText(wordTokens, "en");
// // console.log(wordTokens.length);

// // Map test:
// let wordsMap = getWordsMap(wordTokens);
// // console.log(wordsMap);

// // Most Frequent test:
// // let mostFrequent = getMostFrequent(wordTokens);
// // console.log(mostFrequent);

// // Weigh Test:
// weighWords(wordsMap);
// // console.log(wordsMap);

// // ==== Sentence Tests ====
// let sentenceTokens = tokenizeSentences(test_text);
// filterSentences(sentenceTokens);
// console.log(sentenceTokens);

// // Map Test:
// let sentencesMap = getSentenceMap(sentenceTokens);
// // console.log(sentencesMap);

// // Scoring Test:
// scoreSentences(sentencesMap, wordsMap);
// // console.log(sentencesMap);

// // // Average Weight Test:
// let averageWeight = getAverageWeight(sentencesMap);
// // console.log("Average Weight: " + averageWeight);

// // Summarisation Test:
// let summary = summarise(test_text, english);
// // console.log(summary);