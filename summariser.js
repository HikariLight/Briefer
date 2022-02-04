// Article link: https://www.theverge.com/2022/1/10/22876061/samsung-qd-oled-quantum-dot-tv-panels-sgs-certification-brightness-color-viewing-angles
let test_text = `Importantly, Samsung Display’s new panel appears to achieve this without sacrificing the existing benefits of OLED displays. These include pure blacks where no light is being emitted at all, not to mention excellent viewing angles compared to typical LCD TVs. In fact, SGS says the viewing angles of Samsung Display’s QD-OLEDs are even better than existing OLEDs, maintaining 80 percent of luminance when viewed from a 60-degree angle compared to 53 percent for a conventional OLED.

An important caveat is that all of these comparisons were made with LG’s 2021 flagship, which is due to be superseded this year when it releases a new lineup of OLED TVs. LG Display also has a new generation of OLED panels of its own, dubbed OLED EX, which it says offer increased brightness levels of up to 30 percent. Whether that’s enough to remain competitive with Samsung’s new panels remains to be seen.

We’ll still have to wait for consumer TVs to actually make it to market using both panels before we can be completely sure of these readings, but it’s looking like an impressive set of results for Samsung Display’s latest technology. And Samsung’s display arm produces panels for a variety of companies, so it won’t just be Samsung’s own TVs that benefit.

The question still remains when, exactly, Samsung Display’s new panels will actually go on sale. Interestingly the first QD-OLED TV to be announced wasn’t from Samsung Electronics, but was instead from Sony which said its Bravia XR A95K will use a QD-OLED panel from Samsung Display. Alienware also has a QD-OLED computer monitor in the works. When Samsung Electronics will eventually release a QD-OLED TV of its own is anyone’s guess.
`;

import { detectLanguage } from "./languageDetection.js";

const getNotMeaningful = (language) => {

    let result = [];

    if(language == "english"){
        result = ["and", "the", "or", "is", "of", "a", "to", "be", "of", "which", "it", "is", "has", "not", "in", "for", "no", "than", "are"];
    }

    else if(language == "french"){
        result = ["comme", "je", "son", "sur", "que", "il", "était", "pour", "et","le", "la", "les", "est", "dans", "avec", "ils", "être", "avoir", "par", "de", "ou", "eu", "mais", "un", "une", "pas", "a"];
    }

    else if(language == "german"){
        result = ["wie", "ich", "seine", "dass", "er", "war", "für", "auf", "sind", "mit", "sie", "sein", "bei", "ein", "haben", "dies" ,"aus", "durch", "heiß", "Wort"];
    }

    else if(language == "dutch"){
        result = ["als", "i", "zijn", "dat", "hij", "was", "voor", "op", "met", "ze", "bij", "een", "hebben", "deze", "van", "door" ,"heet", "woord", "maar", "wat"];
    }

    else if(language == "spanish"){
        result = ["como", "i", "su", "que", "él", "era", "para", "en", "son", "con", "ellos", "ser", "en", "uno", "tener", "este" ,"desde", "por", "caliente", "palabra"];
    }

    else if(language == "italian"){
        result = ["come", "io", "suo", "su", "che", "è", "era", "per", "e", "il", "è", "in", "con", "loro", "essere", "avere", "da", "di", "o", "aveva", "ma", "un", "non"];
    }
    
    return result;
}

const filterWord = (word) => {

    // Filters a word out of punctuation and spaces

    let result = word;
    let punctuation = [".", ",", "!", "?", ";"];

    if(punctuation.includes(word.at(-1) || word.at(-1) == " ")){
        result = word.slice(0, -1);
    }

    return result;
}

const filterText = (wordTokens) => {

    // Filters text of unwanted words, punctuation and spaces.

    let textSample = wordTokens.slice(0, 25).join(" ");
    let language = detectLanguage(textSample);
    // let language = "english";
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

const filterSentences = (sentenceTokens) =>{

    // Filters sentences out of things that might make the words uncreognisable by the wordsMap.

    for(let i = 0; i < sentenceTokens.length; i++){
        filterText(sentenceTokens[i]);
    }
}

const tokenizeWords = (text) => {

    // Returns a list of all words in a given string

    return text.split(" ");
}

const tokenizeSentences = (text) => {

    // Returns a list of all the sentences.

    let word = "";
    let sentence = [];
    let sentences = [];

    for (let c of text){
        word += c;

        if(c == " "){
            sentence.push(word);
            word = "";
        }

        if(c == "."){
            sentence.push(word);
            sentences.push(sentence);
            sentence = [];
            word = "";
        }
    }
    
    return sentences;
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
        sentence = sentence.join("");
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

const summarise = (text) =>{
    
    // Main function. Returns a string that represents the summary of the input text.

    let result = "";

    let wordTokens = tokenizeWords(text);
    filterText(wordTokens);
    let wordsMap = getWordsMap(wordTokens);
    weighWords(wordsMap);

    let sentenceTokens = tokenizeSentences(text);
    filterSentences(sentenceTokens);
    let sentencesMap = getSentenceMap(sentenceTokens);
    scoreSentences(sentencesMap, wordsMap);
    let averageWeight = getAverageWeight(sentencesMap)

    for(let sentence in sentencesMap){
        if(sentencesMap[sentence] >= averageWeight){
            result += sentence;
        }
    }

    return result;
}

export { summarise };

// // ======== Tests ========

// // Language Detection test:
// let language = detectLanguage(test_text);
// // console.log(language);

// // ==== Word Tests ====
// let wordTokens = tokenizeWords(test_text);
// // console.log(wordTokens);

// // Filtering Test:
// filterText(wordTokens);
// // console.log(wordTokens);

// // Map test:
// let wordsMap = getWordsMap(wordTokens);
// // console.log(wordsMap);

// // Most Frequent test:
// let mostFrequent = getMostFrequent(wordTokens);
// // console.log(mostFrequent);

// // Weigh Test:
// weighWords(wordsMap);
// // console.log(wordsMap);

// // ==== Sentence Tests ====
// let sentenceTokens = tokenizeSentences(test_text);
// filterSentences(sentenceTokens);
// // console.log(sentenceTokens);

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
// let summary = summarise(test_text);
// // console.log(summary);