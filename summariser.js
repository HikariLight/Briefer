// Article link: https://www.theverge.com/2022/1/10/22876061/samsung-qd-oled-quantum-dot-tv-panels-sgs-certification-brightness-color-viewing-angles
let test_text = `Importantly, Samsung Display’s new panel appears to achieve this without sacrificing the existing benefits of OLED displays. These include pure blacks where no light is being emitted at all, not to mention excellent viewing angles compared to typical LCD TVs. In fact, SGS says the viewing angles of Samsung Display’s QD-OLEDs are even better than existing OLEDs, maintaining 80 percent of luminance when viewed from a 60-degree angle compared to 53 percent for a conventional OLED.

An important caveat is that all of these comparisons were made with LG’s 2021 flagship, which is due to be superseded this year when it releases a new lineup of OLED TVs. LG Display also has a new generation of OLED panels of its own, dubbed OLED EX, which it says offer increased brightness levels of up to 30 percent. Whether that’s enough to remain competitive with Samsung’s new panels remains to be seen.

We’ll still have to wait for consumer TVs to actually make it to market using both panels before we can be completely sure of these readings, but it’s looking like an impressive set of results for Samsung Display’s latest technology. And Samsung’s display arm produces panels for a variety of companies, so it won’t just be Samsung’s own TVs that benefit.

The question still remains when, exactly, Samsung Display’s new panels will actually go on sale. Interestingly the first QD-OLED TV to be announced wasn’t from Samsung Electronics, but was instead from Sony which said its Bravia XR A95K will use a QD-OLED panel from Samsung Display. Alienware also has a QD-OLED computer monitor in the works. When Samsung Electronics will eventually release a QD-OLED TV of its own is anyone’s guess.
`;

var notMeaningful = (word) => {

    // Judges whether a word is meaningful or not.

    let notMeaningful = ["And", "and", "The", "the", "Or", "or", "Is", "is", "Of", "of", "A", "a", "to", "To", "be", "Be", "Of", "of"];

    for(let testWord of notMeaningful){
        if(word == testWord){
            return true;
        }
    }

    return false;
}

var filterText = (text) => {

    let notMeaningful = ["And", "and", "The", "the", "Or", "or", "Is", "is", "Of", "of", "A", "a", "to", "To", "be", "Be", "Of", "of"];

    for(let i = 0; i < text.length; i++){
        if(notMeaningful.includes(text[i])){
            text.splice(i, i);
        }
    }
}

var tokenizeWords = (text) => {

    // Creats a list of all words in a text, while taking out non-meaningful words.

    // let tokenizedText = [];
    // let word = "";

    // for (let c of text){
    //     if(c == "," || c == "." || c == "!" || c == "?" || c == ";"){
    //         continue;
    //     }

    //     word += c;

    //     if(c == " "){
    //         word.slice(0, -1); // Deleting last letter because spaces end up appearing in the words
            
    //         if(!notMeaningful(word)){
    //             tokenizedText.push(word);
    //         }
    //         word = "";
    //     }
    // }

    // return tokenizedText;


    // All of that.. Replaced by this..
    return text.split(" ");
}

var tokenizeSentences = (text) => {

    // Creates a list of all the sentences.

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
            sentences.push(sentence);
            sentence = [];
            word = "";
        }
    }
    
    return sentences;
}

var getObjectText = (textTokens) =>{
    
    // Creates an object of words and their occurences.

    result = {}

    for(let i = 0; i < textTokens.length; i++){
        if(Object.keys(result).includes(textTokens[i])){
            result[textTokens[i]] += 1;
        }
        else{
            result[textTokens[i]] = 1;
        }
    }

    return result;
}

var getMostFrequent = (textObj) =>{

    // Gets the word that is most frequent and its number of occurences.

    let maxOccurence = 0;
    let frequentWord = "";

    for(word in textObj){
        if(textObj[word] > maxOccurence){
            maxOccurence = textObj[word];
            frequentWord = word;
        }
    }

    return [frequentWord, maxOccurence];
}

var weighText = (textObj) =>{

    // Replaces word occurences with their weights in textObj

    let mostFrequent = getMostFrequent(textObj);

    for(word in textObj){
        textObj[word] /= mostFrequent[1];
    }

}

var weighSentence = (sentence, words) =>{
    
    // Calculates the score of a single sentence.

    let result = 0;

    for(let i = 0; i < sentence.length; i++){
        result += words[sentence[i]];
    }

    return result;
}

var weightSentences = (tokenizedSentences) =>{
    
    // Returns a dictionary of sentences and their weights.

    let weighedSentences = {};

    for(let i = 0; i < tokenizeSentences.length; i++){
        for(let j = 0; tokenizeSentences[i].length; j++){
            if(Object.keys(weighedSentences).includes(textTokens[i])){
                weighedSentences[tokenizeSentences[i]] = weighSentence(tokenizeSentences[i][j]);
            }
            else{
                weighedSentences[tokenizeSentences[i]] += weighSentence(tokenizeSentences[i][j]);
            }
        }
    }

    return weighedSentences;
}

var getAverageWeight = (sentences) =>{

    // Returns the average sentence weight so we can use it as a threshhold in summarisation.

}

var summarise = (text) =>{
    
    // Main function.

}

// var tokenizedSentences = tokenizeSentences(test_text);
// console.log(tokenizedSentences);

var tokenizedWords = tokenizeWords(test_text);
console.log(tokenizedWords);
// tokenizedWords = getObjectText(tokenizedWords);