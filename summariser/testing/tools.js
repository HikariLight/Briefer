// File containing tooling functions I use for testing and validation.
// Has no importance in the core functionality.

const getArticleLength = (contentList) =>{

    let result = 0;

    for(let section of contentList){
        for(let element of section){
            if(element[0] == "p"){
                result += element[1].join(" ").length;
            }
        }
    }

    return result;
}

const getReductionRate = (originalLength, summarisedLength) => {
    return 100 - ((summarisedLength / originalLength) * 100);
}

export { getArticleLength, getReductionRate }