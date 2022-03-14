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

    if(wordTokens == null || wordTokens.length == 0){
        throw {
            name : 'EmptyInputError', message : 'wordTokens is empty', fileName : 'filters.js', functionName : 'filterText()'
        }
    }
    
    if(language == null || language == "" || typeof(language) != "string"){
        throw {
            name : 'TypeError', message : '"language" is ' + typeof(language) +' instead of string', fileName : 'filters.js', functionName : 'filterText()'
        }
    }

    let result = []
    let notMeaningful = getNotMeaningful(language);
    let word;

    for(let i = 0; i < wordTokens.length; i++){
        word = wordTokens[i].replaceAll(/[.,\[\]\/"'#!$%\^&\*;:{}=\-_`~()]/g, "");

        if(word == ""){
            continue;
        }

        if(notMeaningful.includes(word.toLowerCase())){
            continue;
        }

        result.push(word);
    }

    return result;
}

const getSentenceFilterList = (language) => {

    // returns a list of common sentence openers depending on language.

    if(language == null || language == "" || typeof(language) != "string"){
        throw {
            name : 'EmptyInputError', message : 'language is not specified' ,fileName : 'filters.js', functionName : 'getSentenceFilterList()'
        }
    }

    let result = [];

    if(language == "en"){
        result = ["And,", "Also,", "Thus,", "In any case,", "In the same way,", "Another reason,", "However,", "In contrast,", "Nevertheless,", "Nonetheless,", "Yet,", "On the other hand,", "By comparaison,", "On the contrary,", "Instead,", "Unlike,", "Otherwise,", "At the same time,", "Conversely,", "Even so,", "Whereas,"];
    }
    
    else if(language == "fr"){
        result = ["Et,", "Aussi,", "Ainsi,", "En tout cas,", "De la même façon,", "Une autre raison,", "Cependant,", "En revanche,", "Néanmoins,", "Néanmoins,", "Pourtant,", "Par contre,", "Par comparaison,", "Au contraire,", "Au contraire,", "Contrairement,", "Autrement,", "En même temps,", "Inversement,", "Quand même,", "Attendu,"];
    }
    
    else if(language == "de"){
        result = ["Und,", "Auch,", "So,", "Auf jeden Fall,", "Ebenso,", "Ein anderer Grund,", "Jedoch,", "Im Gegensatz,", "Trotzdem,", "Trotzdem,", "Doch,", "Andererseits", "Im Vergleich", "Im Gegenteil", "Stattdessen", "Im Gegensatz", "Sonst", "Gleichzeitig", "Umgekehrt", "Auch so", "Wohingegen"];
    }

    else if(language == "nl"){
        result = ["En,", "Ook,", "Dus,", "In ieder geval,", "Op dezelfde manier,", "Een andere reden,", "Maar,", "In tegenstelling,", "Niettemin,", "Niettemin,", "Maar toch,", [Anderzijds], "Ter vergelijking", "Integendeel", "In plaats daarvan", "In tegenstelling tot", "Anders", "Tegelijkertijd", "Tegenovergesteld", "Zelfs zo", "Overwegende dat"];
    }

    else if(language == "es"){
        result = ["Y,", "También,", "Así,", "En cualquier caso,", "De la misma manera,", "Otra razón,", "Sin embargo,", "En contraste,", "No obstante,", "Sin embargo,", "Por otra parte,", "En comparación,", "Por el contrario,", "En cambio,", "A diferencia de,", "Por lo demás,", "Al mismo tiempo,", "A la inversa,", "Aun así,", "Considerando,"];
    }

    else if(language == "it"){
        result = ["E,", "Anche,", "Così,", "In ogni caso,", "Allo stesso modo,", "Un'altra ragione,", "Tuttavia,", "In contrasto,", "Tuttavia,", "Ciononostante,", "Eppure,", "D'altra parte,", "A confronto,", "Al contrario,", "Invece,", "A differenza,", "Altrimenti,", "Allo stesso tempo,", "Al contrario,", "Anche così,", "Mentre,"];
    }

    else if(language == "pt"){
        result = ["E,", "Também,", "Assim,", "Em qualquer caso,", "Da mesma forma,", "Outra razão,", "No entanto,", "Em contraste,", "No entanto,", "Ainda assim,", "Ainda assim,", "Ainda,", "Por outro lado,", "Por comparação,", "Pelo contrário,", "Ao contrário,", "Ao contrário,", "Ao contrário,", "Ao contrário,", "Ao mesmo tempo,", "Pelo contrário,", "Mesmo assim,", "Considerando,"];
    }

    return result;
}

const filterSentence = (sentence, language) => {
    
    // Takes out sentence openers

    if(sentence == null || sentence == "" || typeof(sentence) != "string"){
        throw {
            name : 'EmptyInputError', message : 'sentence is empty' ,fileName : 'filters.js', functionName : 'filterSentence()'
        }
    }

    if(language == null || language == "" || typeof(language) != "string"){
        throw {
            name : 'EmptyInputError', message : 'language is not specified' ,fileName : 'filters.js', functionName : 'filterSentence()'
        }
    }

    let filterList = getSentenceFilterList(language);
    let result = "";

    for(let filter of filterList){
        if(filter == sentence.substring(0, filter.length)){
            result = sentence.replace(filter, "");
        }
    }

    return result;
}

export { punctuationFilter, filterText, filterSentence }