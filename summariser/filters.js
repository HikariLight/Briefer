import {checkStringInput, checkObjectInput} from "../exceptionHandling.js";

const getNotMeaningful = (language) => {

    checkStringInput(language, "language", "filters.js", "getNotMeaningful()");

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

    checkObjectInput(wordTokens, "wordTokens", "filters.js", "punctuationFilter()")

    for(let i = wordTokens.length - 1; i >= 0 ; i--){
        wordTokens[i] = wordTokens[i].replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    }
}

const filterText = (wordTokens, language) => {

    // Filters text of unwanted words, punctuation and spaces.

    checkObjectInput(wordTokens, "wordTokens", "filters.js", "filterText()")
    checkStringInput(language, "language", "filters.js", "filterText()")

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

    checkStringInput(language, "language", "filters.js", "getSentenceFilterList()")

    let result = [];

    if(language == "en"){
        result = ["And, ", "Also, ", "In particular, ", "In that respect, ", "But, ", "Thus, ", "In any case, ", "In the same way, ", "Another reason, ", "However, ", "In contrast, ", "Nevertheless, ", "Nonetheless, ", "Yet, ", "On the other hand, ", "By comparison, ", "On the contrary, ", "Instead, ", "Unlike, ", "Otherwise, ", "At the same time, ", "Conversely, ", "Even so, ", "Whereas, ", "And ", "Whereas ", "Specifically, ", "In practice, ", "Meanwhile, ", "That said, ", "From there, ", "In all cases, ", "For example, ", "And furthermore, ", "And of course, "];
    }
    
    else if(language == "fr"){
        result = ["Et, ", "Aussi, ", "En particulier, ", "A cet égard, ", "Mais, ", "Ainsi, ", "En tout cas, ", "De la même manière, ", "Pour une autre raison, ", "Cependant, ", "En revanche, ", "Néanmoins, ", "Néanmoins, ", "Pourtant, ", "D'autre part, ", "Par comparaison, ", "Au contraire, ", "Au lieu de, ", "Contrairement à, ", "Sinon, ", "En même temps, ", "Inversement, ", "Même si, ", "Considérant, ", "Et ", "Attendu que ", "Spécifiquement, ", "En pratique, ", "En attendant, ", "Cela dit, ", "De là, ", "Dans tous les cas, ", "Par exemple, ", "Et en outre, ", "Et bien sûr, "];
    }
    
    else if(language == "de"){
        result = ["Und, ", "Auch, ", "Insbesondere, ", "In dieser Hinsicht, ", "Aber, ", "So, ", "Auf jeden Fall, ", "In gleicher Weise, ", "Ein anderer Grund, ", "Jedoch, ", "Im Gegensatz, ", "Dennoch, ", "Trotzdem, ", "Doch, ", "Andererseits, ", "Im Vergleich, ", "Im Gegenteil, ", "Stattdessen, ", "Im Gegensatz, ", "Sonst, ", "Gleichzeitig, ", "Umgekehrt, ", "Trotzdem, ", "Wohingegen, ", "Und ", "Wohingegen ", "Insbesondere, ", "In der Praxis, ", "Inzwischen, ", "Das heißt, ", "Von daher, ", "In allen Fällen, ", "Zum Beispiel, ", "Und außerdem, ", "Und natürlich, "];
    }

    else if(language == "nl"){
        result = ["En, ", "Ook, ", "In het bijzonder, ", "In dat opzicht, ", "Maar, ", "Dus, ", "In ieder geval, ", "Op dezelfde manier, ", "Een andere reden, ", "Echter, ", "In tegenstelling, ", "Niettemin, ", "Niettemin, ", "Toch, ", "Anderzijds, ", "In vergelijking, ", "In tegendeel, ", "In plaats daarvan, ", "Anders, ", "Anders, ", "Tegelijkertijd, ", "Omgekeerd, ", "Zelfs zo, ", "Overwegende dat, ", "En ", "Overwegende dat ", "Specifiek, ", "In de praktijk, ", "Ondertussen, ", "Dat gezegd hebbende, ", "Van daar, ", "In alle gevallen, ", "Bijvoorbeeld, ", "En verder, ", "En natuurlijk, "];
    }

    else if(language == "es"){
        result = ["Y, ", "También, ", "En particular, ", "En ese sentido, ", "Pero, ", "Así, ", "En cualquier caso, ", "De la misma manera, ", "Otra razón, ", "Sin embargo, ", "En contraste, ", "No obstante, ", "No obstante, ", "Sin embargo, ", "Por otra parte, ", "En comparación, ", "Por el contrario, ", "En cambio, ", "A diferencia de, ", "Por lo demás, ", "Al mismo tiempo, ", "A la inversa, ", "Aun así, ", "Mientras que, ", "Y ", "Mientras que ", "Específicamente, ", "En la práctica, ", "Mientras tanto, ", "Dicho esto, ", "De ahí, ", "En todos los casos, ", "Por ejemplo, ", "Y además, ", "Y por supuesto, "];
    }

    else if(language == "it"){
        result = ["E, ", "Anche, ", "In particolare, ", "A questo proposito, ", "Ma, ", "Così, ", "In ogni caso, ", "Allo stesso modo, ", "Un'altra ragione, ", "Tuttavia, ", "In contrasto, ", "Tuttavia, ", "Nondimeno", "Eppure", "D'altra parte, ", "In confronto, ", "Al contrario, ", "Invece, ", "A differenza, ", "Altrimenti, ", "Allo stesso tempo, ", "Al contrario, ", "Anche così, ", "Mentre, ", "E ", "Considerando ", "Nello specifico, ", "In pratica, ", "Nel frattempo, ", "Detto questo, ", "Da lì, ", "In tutti i casi, ", "Per esempio, ", "E inoltre, ", "E naturalmente "];
    }

    else if(language == "pt"){
        result = ["E, ", "Também, ", "Em particular, ", "A esse respeito, ", "Mas, ", "Assim, ", "Em qualquer caso, ", "Do mesmo modo, ", "Outro motivo, ", "No entanto, ", "Em contraste, ", "Não obstante, ", "Não obstante, ", "Ainda assim, ", "Por outro lado, ", "Em comparação, ", "Pelo contrário, ", "Em vez disso, ", "Ao contrário, ", "Ao contrário, ", "Caso contrário, ", "Ao mesmo tempo, ", "Inversamente, ", "Mesmo assim, ", "Considerando que, ", "E ", "Considerando ", "Especificamente, ", "Na prática, ", "Entretanto, ", "Dito isto, ", "A partir daí, ", "Em todos os casos, ", "Por exemplo, ", "E, além disso, ", "E claro, ",];
    }

    return result;
}

const filterSentence = (sentence, language) => {
    
    // Input: A sentence in string form.
    // Output: same sentence without the openers.

    checkStringInput(sentence, "sentence", "filters.js", "filterSentence()")
    checkStringInput(language, "language", "filters.js", "filterSentence()")

    let filterList = getSentenceFilterList(language);
    let result = sentence;

    for(let filter of filterList){
        if(filter == sentence.substring(0, filter.length)){
            result = sentence.replace(filter, "");
            result = result.charAt(0).toUpperCase() + result.slice(1);
        }
    }

    return result;
}

export { punctuationFilter, filterText, filterSentence }