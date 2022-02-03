const processText = (text) => {
    return text.split(" ").slice(0, Math.min(text.length, 30));
}

const score = (processedText) => {

    const english = ["and", "the", "or", "is", "of", "a", "to", "be", "of", "which", "it", "is", "has", "not", "in", "for", "no", "than", "are"];
    const french = ["comme", "je", "son", "sur", "que", "il", "était", "pour", "et","le", "la", "les", "est", "dans", "avec", "ils", "être", "avoir", "par", "de", "ou", "eu", "mais", "un", "une", "pas", "a"];
    const german = ["wie", "ich", "seine", "dass", "er", "war", "für", "auf", "sind", "mit", "sie", "sein", "bei", "ein", "haben", "dies" ,"aus", "durch", "heiß", "Wort"];
    const dutch = ["als", "i", "zijn", "dat", "hij", "was", "voor", "op", "met", "ze", "bij", "een", "hebben", "deze", "van", "door" ,"heet", "woord", "maar", "wat"];
    const spanish = ["como", "i", "su", "que", "él", "era", "para", "en", "son", "con", "ellos", "ser", "en", "uno", "tener", "este" ,"desde", "por", "caliente", "palabra"];
    const italian = ["come", "io", "suo", "su", "che", "è", "era", "per", "e", "il", "è", "in", "con", "loro", "essere", "avere", "da", "di", "o", "aveva", "ma", "un", "non"];

    let result = {
        "english": 0,
        "french": 0,
        "german": 0,
        "dutch": 0,
        "italian": 0,
        "spanish": 0
    }

    for(let word of processedText){
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
let english_test = detectLanguage("This is a test. I'm not sure if it will work but we will see.");
let french_test = detectLanguage("C'est un test. Je ne suis pas sûr que ça va marcher mais nous verrons.");
let german_test = detectLanguage("Dies ist ein Test. Ich bin mir nicht sicher, ob es funktionieren wird, aber wir werden sehen.");
let dutch_test = detectLanguage("Dit is een test. Ik ben niet zeker of het zal werken, maar we zullen zien.");
let italian_test = detectLanguage("Questo è un test. Non sono sicuro che funzionerà, ma vedremo.");
let spanish_test = detectLanguage("Esto es una prueba. No estoy seguro de que vaya a funcionar, pero ya veremos.");

// console.log(spanish_test);