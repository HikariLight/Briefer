const tokenizeWords = (text) => {

    // Returns a list of all words in a given string

    if(text == null || text.length == 0){
        throw {
            name : 'RangeError', message : '"text" is empty', fileName : 'tokenization.js', functionName : 'tokenizeWords()', lineNumber : 1
        }
    }

    if(typeof(text) != "string"){
        throw {
            name : 'TypeError', message : '"text" is ' + typeof(text) +' instead of string', fileName : 'tokenization.js', functionName : 'tokenizeWords()', lineNumber : 1
        }
    }

    return text.replaceAll("-", " ").split(" ");
}

const tokenizeSentences = (text) =>{

    // Returns a list of all the sentences.

    if(text == null || text.length == 0){
        throw {
            name : 'RangeError', message : '"text" is empty', fileName : 'tokenization.js', functionName : 'tokenizeSentences()', lineNumber : 20
        }
    }

    if(typeof(text) != "string"){
        throw {
            name : 'TypeError', message : '"text" is ' + typeof(text) +' instead of string', fileName : 'tokenization.js', functionName : 'tokenizeSentences()', lineNumber : 20
        }
    }

    let result = text.split(". ");

    for(let i = 0; i < result.length; i++){
        result[i] = tokenizeWords(result[i]);
    }
    
    return result;
}

export {tokenizeWords, tokenizeSentences}