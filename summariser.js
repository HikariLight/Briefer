const aggregateText = (textList) => {

    // Aggregates the entire text of the page into a string.
    // Needed mostly for getUniversalWordsMap()
    
    let result = [];
    
    for(let section of textList){
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

    // DEPRECATED
    // Filters sentences out of things that might make the words uncreognisable by the wordsMap.
    // To be rewritten to remove connectors at the start of sentences.

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

const getUniversalWordsMap = (textList, language) => {

    // Creates a Words Map using the whole page as input

    let text = aggregateText(textList)
    let tokenizedWords = tokenizeWords(text);
    filterText(tokenizedWords, language);

    let result = getWordsMap(tokenizedWords);
    weighWords(result);

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

const summarise = (textList, wordsMap) =>{

    // Main function. Returns a string that represents the summary of the input text.

    let result = [];
    let text = textList.join(" ");

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

export { summarise, getUniversalWordsMap, testCase };

// // // ======== Tests ========

// Source: https://arstechnica.com/science/2022/02/hydrogen-soaked-crystal-lets-neural-networks-expand-to-match-a-problem/
const testCase = [
    {
        "img": "https://cdn.arstechnica.net/wp-content/uploads/2022/02/GettyImages-1201452137-800x450.jpg",
        "p": [
            "Training AIs remains very processor-intensive, in part because traditional processing architectures are poor matches for the sorts of neural networks that are widely used. This has led to the development of what has been termed neuromorphic computing hardware, which attempts to model the behavior of biological neurons in hardware.",
            "But most neuromorphic hardware is implemented in silicon, which limits it to behaviors that are set at the hardware level. A group of US researchers is now reporting a type of non-silicon hardware that's substantially more flexible. It works by controlling how much hydrogen is present in an alloy of nickel, with the precise amount of hydrogen switching a single device among four different behaviors, each of which is useful for performing neural-network operations."
        ]
    },
    {
        "h1": "Give it the gas",
        "p": [
            "The material being used here is one of a class of compounds called perovskite nickelates. Perovskite is a general term for a specific arrangement of atoms in a crystalline structure; a wide variety of chemicals can form perovskites. In this case, the crystal is formed from a material that's a mix of neodymium, nickel, and oxygen.",
            "The crystal structure has enough open space that it can readily absorb and hold onto hydrogen. Once the hydrogen is incorporated, its electron will often end up being transferred to one of the nickel atoms. This changes the electrical properties of the atom and, in doing so, changes the conductivity of the material in general. The degree to which they change depends on how much hydrogen is present.",
            "Since the hydrogen ends up with a positive charge after giving up its electron, it can be controlled by externally applied electric fields. So, by controlling the electrical environment, it's possible to redistribute the hydrogen within the perovskite structure. That will then change the conductive properties of the material.",
            "The researchers show that these states are meta-stable: they'll change if an external force is applied but will remain stable for up to six months without the need to refresh the hydrogen. It's not clear whether it needs to be refreshed at that point or whether that's simply the latest they checked.",
            "In any case, the researchers create a device simply by hooking up the perovskite to electrodes in a hydrogen atmosphere. (Getting the hydrogen into the material requires one electrode to be made from platinum or palladium.) From there, they demonstrated that it can be reliably switched among four states.",
            "One state allows it to act as a resistor, meaning the device can act as a memristor. Similarly, it'll behave as a memcapacitor, holding charge if set in that state. When in spiking neuron mode, it will accumulate multiple signals, at which point its resistance changes dramatically. This mimics how a neuron requires incoming spikes to exceed a threshold before it switches into an active state. Finally they had a configuration that acted like a synapse (at least in neural-network terms), transforming an input based on its strength.",
            "Obviously, it's possible to do similar things with dedicated devices for each of the four functions if you're willing to activate and shut off different parts of a chip when needed. But many of these behaviors are analog, something that silicon requires even more hardware to emulate. Here, all this is done with a single bit of material between two electrodes."
        ]
    },
    {
        "h1": "But what’s it good for?",
        "p": [
            "After having demonstrated a single device can work, rather than struggling to build a chip containing a lot of them, the team shifted over to building models based on its behavior. They built different types of neural networks that were used to interpret a couple of standard AI tests—written and spoken digit recognition—along with a fairly recent practical example: EKG characterization.",
            "One thing the researchers modeled was something called reservoir computing. This approach to AI tries to limit the cost of training a system by setting up a multi-layer neural network, and then only training the final layer before the output—in essence, training the output neurons to pay attention to specific parts of the reservoir. Here, the flexibility of the devices meant that fewer of them were needed in the reservoir in order to provide similar performance to more traditional hardware.",
            "Another problem that was modeled was the response of a network to having a changing number of items it needed to recognize. An example of this would be a system that was trained to recognize fish and cats, and then later had images of birds mixed in. Or one that was trained to recognize all fish, cats, birds, and lizards but in the end was only shown images of fish and lizards. Ideally, a system can learn on the fly or scale down on its computational requirements if it was initially overtrained.",
            "Again, the flexibility of having a device that can be reconfigured into different behaviors on the fly made a big difference. When left to reconfigure itself in response to a reduced set of input images, the system could drop nearly half its nodes without losing performance. Alternately, as the researchers added tasks it was untrained for, the system learned so well that its accuracy more than doubled that of a system with traditional hardware.",
            "None of this is to say that we're going to be building these things and swapping them into data centers any time soon. There are a lot of issues—cost of materials, ease of manufacturing, integration with silicon hardware—that would need to be worked out before we could even start to understand whether these offer any sort of benefit in terms of performance or energy use.",
            "But it's clear that the mismatch between AI and traditional silicon hardware is inducing a lot of experimentation with alternate technology, including different ways of using silicon. There are parallels there to what's going on with quantum computing, although with a key difference: we already have complicated AI algorithms in use, whereas with quantum computers, we're still waiting for the hardware that will allow our algorithms to run."
        ]
    }
];

// // Aggregate Text test
// let test_text = aggregateText(testCase);
// // console.log(test_text);

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

// UniversalWordsMap test
// let universalWordsMap = getUniversalWordsMap(testCase);
// // console.log(universalWordsMap);

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