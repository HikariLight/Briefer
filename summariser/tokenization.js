const tokenizeWords = (text) => {

    // Returns an array of all words in a given string

    if(text == null || text.length == 0){
        throw {
            name : 'EmptyInputError', message : '"text" is empty', fileName : 'tokenization.js', functionName : 'tokenizeWords()'
        }
    }

    if(typeof(text) != "string"){
        throw {
            name : 'TypeError', message : '"text" is ' + typeof(text) +' instead of string', fileName : 'tokenization.js', functionName : 'tokenizeWords()'
        }
    }

    return text.replaceAll("-", " ").split(" ");
}

const tokenizeSentences = (text) =>{

    // Returns a list of all the sentences.

    if(text == null || text.length == 0){
        throw {
            name : 'EmptyInputError', message : '"text" is empty', fileName : 'tokenization.js', functionName : 'tokenizeSentences()'
        }
    }

    if(typeof(text) != "string"){
        throw {
            name : 'TypeError', message : '"text" is ' + typeof(text) +' instead of string', fileName : 'tokenization.js', functionName : 'tokenizeSentences()'
        }
    }

    let result = text.split(". ").filter(sentence => sentence.length > 0);

    try{
        for(let i = 0; i < result.length; i++){
            result[i] = tokenizeWords(result[i]);
        }
    } catch(error){
        console.log(error);
    }
    
    return result;
}

export {tokenizeWords, tokenizeSentences}