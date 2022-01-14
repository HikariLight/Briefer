// Article link: https://www.theverge.com/2022/1/10/22876061/samsung-qd-oled-quantum-dot-tv-panels-sgs-certification-brightness-color-viewing-angles
let test_text = `Importantly, Samsung Display’s new panel appears to achieve this without sacrificing the existing benefits of OLED displays. These include pure blacks where no light is being emitted at all, not to mention excellent viewing angles compared to typical LCD TVs. In fact, SGS says the viewing angles of Samsung Display’s QD-OLEDs are even better than existing OLEDs, maintaining 80 percent of luminance when viewed from a 60-degree angle compared to 53 percent for a conventional OLED.

An important caveat is that all of these comparisons were made with LG’s 2021 flagship, which is due to be superseded this year when it releases a new lineup of OLED TVs. LG Display also has a new generation of OLED panels of its own, dubbed OLED EX, which it says offer increased brightness levels of up to 30 percent. Whether that’s enough to remain competitive with Samsung’s new panels remains to be seen.

We’ll still have to wait for consumer TVs to actually make it to market using both panels before we can be completely sure of these readings, but it’s looking like an impressive set of results for Samsung Display’s latest technology. And Samsung’s display arm produces panels for a variety of companies, so it won’t just be Samsung’s own TVs that benefit.

The question still remains when, exactly, Samsung Display’s new panels will actually go on sale. Interestingly the first QD-OLED TV to be announced wasn’t from Samsung Electronics, but was instead from Sony which said its Bravia XR A95K will use a QD-OLED panel from Samsung Display. Alienware also has a QD-OLED computer monitor in the works. When Samsung Electronics will eventually release a QD-OLED TV of its own is anyone’s guess.
`;

const tokenizeWords = (text) => {

    // Returns a list of all words in a given string

    return text.split(" ");
}

const filterText = (text) => {

    // Filters text of unwanted words.
    // == PROBLEM: Only deletes the first occurence of an unwanted word. == 

    let notMeaningful = ["And", "and", "The", "the", "Or", "or", "Is", "is", "Of", "of", "A", "a", "to", "To", "be", "Be", "Of", "of", "Which", "which", "it", "It", "is"];
    let punctuation = [".", ",", "!", "?", ";"];

    for(let i = 0; i < text.length; i++){
        if(notMeaningful.includes(text[i])){
            // text.splice(i, 1);
            // This possibly fixes the problem
            text[i] = "";
        }

        if(punctuation.includes(text[i].at(-1))){
            text[i] = text[i].substr(0, text[i].length - 1);
        }

        if(text[i].at(-1) == " "){
            text[i] = text[i].substr(0, text[i].length - 1);
        }
    }
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
            // filterText(sentence);
            sentences.push(sentence);
            sentence = [];
            word = "";
        }
    }
    
    return sentences;
}

const filterSentences = (sentenceTokens) =>{
    for(let i = 0; i < sentenceTokens.length; i++){
        // console.log("========= SENTENCE FILTER =========\n");
        filterText(sentenceTokens[i]);
    }
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

    for(word in tokenizedWords){
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

    for(word in wordsMap){
        wordsMap[word] /= mostFrequent[1];
    }

}

const scoreSentence = (sentence, wordsMap) =>{
    
    // Calculates the score of a single sentence.

    let result = 0;

    for(let i = 0; i < sentence.length; i++){
        if(Object.keys(wordsMap).includes(sentence[i])){
            result += wordsMap[sentence[i]];
        }
    }

    return result;
}

const scoreSentences = (sentenceTokens, wordsMap) =>{
    
    // Returns a dictionary of sentences and their weights.

    let scoredSentences = {};

    for(let i = 0; i < sentenceTokens.length; i++){
        if(Object.keys(scoredSentences).includes(sentenceTokens[i])){
            scoredSentences[sentenceTokens[i]] += scoreSentence(sentenceTokens[i], wordsMap);
        }
        else{
            scoredSentences[sentenceTokens[i]] = scoreSentence(sentenceTokens[i], wordsMap);
        }
    }

    return scoredSentences;
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
    
    // Main function.

    let result = "";

    let wordTokens = tokenizeWords(text);
    filterText(wordTokens);
    let wordsMap = getWordsMap(wordTokens);
    weighWords(wordsMap);

    let sentenceTokens = tokenizeSentences(text);
    filterSentences(sentenceTokens);
    let sentenceMap = scoreSentences(sentenceTokens, wordsMap);
    let averageWeight = getAverageWeight(sentenceMap)

    for(sentence in sentenceMap){
        if(sentenceMap[sentence] >= averageWeight){
            result += "\n";
            result += sentence;
        }
    }

    return result;

}

// // ======== Tests ========

// // ==== Word Tests ====
// let wordTokens = tokenizeWords(test_text);

// // Filtering Test:
// // console.log(wordTokens);
// // console.log("Not filtered size: " + wordTokens.length);
// filterText(wordTokens);
// // console.log(wordTokens);
// // console.log("Filtered size: " + wordTokens.length);

// // Map test:
// let wordsMap = getWordsMap(wordTokens);
// // console.log(wordsMap);

// // Weigh Test:
// weighWords(wordsMap);
// // console.log(wordsMap);

// // ==== Sentence Tests ====
// let sentenceTokens = tokenizeSentences(test_text);
// filterSentences(sentenceTokens);
// // console.log(sentenceTokens);

// // // Scoring Test:
// let sentenceMap = scoreSentences(sentenceTokens, wordsMap);
// // console.log(sentenceMap);

// // Average Weight Test:
// let averageWeight = getAverageWeight(sentenceMap);
// console.log("Average Weight is: " + averageWeight);

// Summarisation Test:
let summary = summarise(test_text);
console.log(summary);