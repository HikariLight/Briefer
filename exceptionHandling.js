const checkIfNull = (element, variableName, fileName, functionName) =>{
    if(element == null){
        throw {
            name : 'EmptyInputError',
            message : `${variableName} is null`,
            fileName : `${fileName}`,
            functionName: `${functionName}`
        }
    } 
}

const checkLength = (element, variableName, fileName, functionName) =>{
    if(element == null || element.length == 0){
        throw {
            name : 'EmptyInputError',
            message : `${variableName} is empty`,
            fileName : `${fileName}`,
            functionName: `${functionName}`
        }
    }
}

const checkIfString = (element, variableName, fileName, functionName) =>{
    if(typeof(element) != "string"){
        throw {
            name : 'TypeError',
            message : `${variableName}" is ${typeof(element)} instead of string`,
            fileName : `${fileName}`,
            functionName: `${functionName}`
        }
    }
}

const checkIfObject = (element) =>{
    if(typeof(element) != "object"){
        throw {
            name : 'TypeError',
            message : `${variableName} is ${typeof(element)} instead of object`,
            fileName : `${fileName}`,
            functionName: `${functionName}`
        }
    }
}

export { checkIfNull, checkLength, checkIfString, checkIfObject }