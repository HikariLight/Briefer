const processText = (text) => {
    return text.split(" ").slice(0, Math.min(text.length, 30));
}

const score = (processedText) => {

    // 25 most common words of each language
    const english = ["as", "I", "his", "that", "he", "was", "for", "on", "are", "with", "they", "be", "at", "one", "have", "this", "from", "by", "hot", "word", "but", "what", "some", "is", "it"]
    const french = ["comme", "je", "son", "que", "il", "était", "pour", "sur", "sont", "avec", "ils", "être", "à", "un", "avoir", "ce", "à", "par", "chaud", "mot", "mais", "que", "certains", "est", "il"];
    const german = ["wie", "ich", "seine", "dass", "er", "war", "für", "auf", "sind", "mit", "sie", "sein", "bei", "ein", "haben", "dies", "aus", "durch", "heiß", "Wort", "aber", "was", "einige", "ist", "es"];
    const dutch = ["als", "I", "zijn", "dat", "hij", "was", "voor", "op", "zijn", "met", "ze", "zijn", "bij", "een", "hebben", "deze", "van", "door", "heet", "woord", "maar", "wat", "sommige", "is", "het"];
    const spanish = ["como", "I", "su", "que", "él", "era", "para", "en", "son", "con", "ellos", "ser", "en", "uno", "tener", "este", "desde", "por", "caliente", "palabra", "pero", "qué", "algunos", "es", "lo"];
    const italian = ["come", "io", "il", "che", "lui", "era", "per", "su", "sono", "con", "essi", "essere", "a", "uno", "avere", "questo", "da", "da", "caldo", "parola", "ma", "cosa", "alcuni", "è", "esso"];

    let result = {
        "english": 1,
        "french": 1,
        "german": 1,
        "dutch": 1,
        "italian": 1,
        "spanish": 1
    }

    for(let word of processedText){
        word = word.toLowerCase();

        if(english.includes(word)){
            result["english"] += 1;
        }

        if(french.includes(word)){
            result["french"] += 1;
        }

        if(german.includes(word)){
            result["german"] += 1;
        }

        if(dutch.includes(word)){
            result["dutch"] += 1;
        }

        if(spanish.includes(word)){
            result["spanish"] += 1;
        }

        if(italian.includes(word)){
            result["italian"] += 1;
        }
    }

    return result;
}

const detectLanguage = (text) => {
    
    let processedText = processText(text);
    let scores = score(processedText);

    let result = "";
    let max = 0;

    for(let language in scores){
        if(scores[language] > max){
            result = language;
            max = scores[language];
        }
    }

    return result;
}

export { detectLanguage } ;

// Tests
// let english_test = detectLanguage("This is a test of if my function works the way it's supposed to. I'm not sure if it will work but I hope it will.");
// let french_test = detectLanguage("C'est un test pour voir si ma fonction fonctionne comme elle est censée le faire. Je ne suis pas sûr qu'elle fonctionnera mais j'espère qu'elle le fera.");
// let german_test = detectLanguage("Dies ist ein Test, ob meine Funktion so funktioniert, wie sie soll. Ich bin nicht sicher, ob es funktioniert, aber ich hoffe, dass es funktioniert.");
// let dutch_test = detectLanguage("Dit is een test. Ik ben niet zeker of het zal werken, maar we zullen zien.");
// let italian_test = detectLanguage("Questo è un test per vedere se la mia funzione funziona come dovrebbe. Non sono sicuro che funzionerà, ma spero di sì.");
// let spanish_test = detectLanguage("Esto es una prueba de si mi función funciona como se supone que debe hacerlo. No estoy seguro de que funcione, pero espero que lo haga.");

// console.log(english_test);
// console.log(french_test);
// console.log(german_test);
// console.log(dutch_test);
// console.log(italian_test);
// console.log(spanish_test);