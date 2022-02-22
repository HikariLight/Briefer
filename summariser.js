import { testCase } from "./testCases.js";

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

    else if(language == "pt"){
        result = ['como', 'i', 'seu', 'que', 'ele', 'foi', 'para', 'em', 'são', 'com', 'eles', 'ser', 'em', 'uma', 'tem', 'este', 'a', 'por', 'quente', 'palavra', 'mas', 'o', 'alguns', 'é', 'ele', 'você', 'ou', 'teve', 'o', 'de'];
    }
    
    return result;
}

const filterText = (wordTokens, language) => {

    // Filters text of unwanted words, punctuation and spaces.

    if(language == null || language == "" || typeof(language) != "string"){
        throw "Summariser Error:\nfilterText() error. Language not specified";
    }

    let notMeaningful = getNotMeaningful(language);

    for(let i = wordTokens.length - 1; i >= 0 ; i--){
        wordTokens[i] = wordTokens[i].replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

        if(notMeaningful.includes(wordTokens[i].toLowerCase())){
            wordTokens.splice(i, 1);
        }
    }
}

const filterSentences = (sentenceTokens, language) =>{

    // DEPRECATED
    // Filters sentences out of things that might make the words uncreognisable by the wordsMap.
    // To be rewritten to remove connectors at the start of sentences.

    for(let i = 0; i < sentenceTokens.length; i++){
        filterText(sentenceTokens[i], language);
    }
}

const tokenizeWords = (text) => {

    // Returns a list of all words in a given string

    if(text == "" || text == null){
        throw "Summariser Error:\ntokenizeWords() error. Empty input.";
    }

    if(typeof(text) != "string"){
        throw "Summariser Error:\ntokenizeWords() error. Wrong input type.\nInput type given: " + typeof(text);
    }

    return text.replaceAll("-", " ").split(" ");
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

const getUniversalWordsMap = (contentObjList, language) => {

    // Creates a Words Map using the whole page as input

    let result = {};

    try{
        let text = aggregateText(contentObjList)
        let tokenizedWords = tokenizeWords(text);
        filterText(tokenizedWords, language);
        result = getWordsMap(tokenizedWords);
        weighWords(result);
    }catch(error){
        console.log(error)
    }

    return result;
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

const summarise = (paragraphList, wordsMap) =>{

    // Main function. Returns a string that represents the summary of the input text.

    let result = [];
    let text = paragraphList.join(" ");

    let sentenceTokens = tokenizeSentences(text);
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

const extract = (contentObjList, language) =>{

    // Deep copy
    let result = JSON.parse(JSON.stringify(contentObjList));

    let wordsMap = getUniversalWordsMap(result, language);
    for(let i = 0; i < result.length; i++){
        if (result[i]["p"] !== undefined) {
            result[i]["p"] = summarise(result[i]["p"], wordsMap);
        }
    }

    return result;
}

export { extract };

// // // ======== Tests ========

// // Aggregate Text test
// let test_text = aggregateText(testCase);
// console.log(test_text);

// // // ==== Word Tests ====
// let wordTokens = tokenizeWords(test_text);
// console.log(wordTokens);

// // Filtering Test:
// console.log(wordTokens.length);
// console.log(wordTokens);
// filterText(wordTokens, "en");
// console.log(wordTokens);
// console.log(wordTokens.length);

// // Map test:
// let wordsMap = getWordsMap(wordTokens);
// // console.log(wordsMap);

// // Most Frequent test:
// // let mostFrequent = getMostFrequent(wordTokens);
// // console.log(mostFrequent);

// // Weigh Test:
// weighWords(wordsMap);
// // console.log(wordsMap);

// UniversalWordsMap test
// let universalWordsMap = getUniversalWordsMap(testCase, "en");
// let universalWordsMap = getUniversalWordsMap([], "en");
// console.log(universalWordsMap);

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
// let summary = "";
// let wordsMap = getUniversalWordsMap(testCase);

// for(let i = 0; i < testCase.length; i++){
//     if (testCase[i]["p"] !== undefined) {
//         summary += summarise(testCase[i]["p"], "en", wordsMap);
//     }
// }

// console.log(summary);