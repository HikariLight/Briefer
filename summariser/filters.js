const getNotMeaningful = (language) => {

    let result = [];

    // 50 Most common words in each language
    if(language == "en"){
        result = ['as', 'i', 'his', 'that', 'he', 'was', 'for', 'on', 'are', 'with', 'they', 'be', 'at', 'one', 'have', 'this', 'from', 'by', 'hot', 'word', 'but', 'what', 'some', 'is', 'it', 'you', 'or', 'had', 'the', 'of', 'to', 'and', 'a', 'in', 'we', 'can', 'out', 'other', 'were', 'which', 'do', 'their', 'time', 'if', 'will', 'how', 'said', 'an', 'each', 'tell'];
    }

    else if(language == "fr"){
        result = ['comme', 'je', 'son', 'que', 'il', 'était', 'pour', 'sur', 'sont', 'avec', 'ils', 'être', 'à', 'un', 'avoir', 'ce', 'à', 'par', 'chaud', 'mot', 'mais', 'que', 'certains', 'est', 'il', 'vous', 'ou', 'eu', 'la', 'de', 'à', 'et', 'un', 'dans', 'nous', 'boîte', 'dehors', 'autre', 'étaient', 'qui', 'faire', 'leur', 'temps', 'si', 'volonté', 'comment', 'dit', 'un', 'chaque', 'dire'];
    }

    else if(language == "de"){
        result = ['wie', 'ich', 'seine', 'dass', 'er', 'war', 'für', 'auf', 'sind', 'mit', 'sie', 'sein', 'bei', 'ein', 'haben', 'dies', 'aus', 'durch', 'heiß', 'Wort', 'aber', 'was', 'einige', 'ist', 'es', 'Sie', 'oder', 'hatte', 'die', 'von', 'zu', 'und', 'ein', 'bei', 'wir', 'können', 'aus', 'andere', 'waren', 'die', 'tun', 'ihre', 'Zeit', 'wenn', 'werden', 'wie', 'sagte', 'ein', 'jeder', 'sagen'];
    }

    else if(language == "nl"){
        result = ['als', 'i', 'zijn', 'dat', 'hij', 'was', 'voor', 'op', 'zijn', 'met', 'ze', 'zijn', 'bij', 'een', 'hebben', 'deze', 'van', 'door', 'heet', 'woord', 'maar', 'wat', 'sommige', 'is', 'het', 'u', 'of', 'had', 'de', 'van', 'aan', 'en', 'een', 'in', 'we', 'kan', 'uit', 'andere', 'waren', 'die', 'doen', 'hun', 'tijd', 'indien', 'zal', 'hoe', 'zei', 'een', 'elk', 'vertellen'];
    }

    else if(language == "es"){
        result = ['como', 'i', 'su', 'que', 'él', 'era', 'para', 'en', 'son', 'con', 'ellos', 'ser', 'en', 'uno', 'tener', 'este', 'desde', 'por', 'caliente', 'palabra', 'pero', 'qué', 'algunos', 'es', 'lo', 'usted', 'o', 'tenido', 'la', 'de', 'a', 'y', 'un', 'en', 'nos', 'lata', 'fuera', 'otros', 'eran', 'que', 'hacer', 'su', 'tiempo', 'si', 'lo', 'cómo', 'dicho', 'un', 'cada', 'decir'];
    }

    else if(language == "it"){
        result = ['come', 'io', 'il', 'che', 'lui', 'era', 'per', 'su', 'sono', 'con', 'essi', 'essere', 'a', 'uno', 'avere', 'questo', 'da', 'da', 'caldo', 'parola', 'ma', 'cosa', 'alcuni', 'è', 'esso', 'voi', 'o', 'aveva', 'il', 'di', 'a', 'e', 'un', 'in', 'noi', 'lattina', 'fuori', 'altro', 'erano', 'che', 'fare', 'loro', 'tempo', 'se', 'volontà', 'come', 'suddetto', 'un', 'ogni', 'dire'];
    }

    else if(language == "pt"){
        result = ['como', 'i', 'seu', 'que', 'ele', 'foi', 'para', 'em', 'são', 'com', 'eles', 'ser', 'em', 'uma', 'tem', 'este', 'a', 'por', 'quente', 'palavra', 'mas', 'o', 'alguns', 'é', 'ele', 'você', 'ou', 'teve', 'o', 'de', 'a', 'e', 'uma', 'em', 'nós', 'lata', 'fora', 'outro', 'foram', 'que', 'fazer', 'seu', 'tempo', 'se', 'vontade', 'como', 'disse', 'uma', 'cada', 'dizer'];
    }
    
    return result;
}

const punctuationFilter = (wordTokens) => {
    for(let i = wordTokens.length - 1; i >= 0 ; i--){
        wordTokens[i] = wordTokens[i].replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    }
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

export { punctuationFilter, filterText }