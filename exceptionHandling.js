const checkIfNull = (input, variableName, fileName, functionName) =>{
    if(input == null){
        throw {
            name : 'EmptyInputError',
            message : `${variableName} is null`,
            fileName : `${fileName}`,
            functionName: `${functionName}`
        }
    } 
}

const checkLength = (input, variableName, fileName, functionName) =>{
    if(input == null || input.length == 0){
        throw {
            name : 'EmptyInputError',
            message : `${variableName} is empty`,
            fileName : `${fileName}`,
            functionName: `${functionName}`
        }
    }
}

const checkIfString = (input, variableName, fileName, functionName) =>{
    if(typeof(input) != "string"){
        throw {
            name : 'TypeError',
            message : `${variableName}" is ${typeof(input)} instead of string`,
            fileName : `${fileName}`,
            functionName: `${functionName}`
        }
    }
}

const checkIfObject = (input) =>{
    if(typeof(input) != "object"){
        throw {
            name : 'TypeError',
            message : `${variableName} is ${typeof(input)} instead of object`,
            fileName : `${fileName}`,
            functionName: `${functionName}`
        }
    }
}

const checkStringInput = (input, variableName, fileName, functionName) =>{
    checkIfNull(input, variableName, fileName, functionName);
    checkIfString(input, variableName, fileName, functionName);
    checkLength(input, variableName, fileName, functionName);
}

const checkObjectInput = (input, variableName, fileName, functionName) =>{
    checkIfNull(input, variableName, fileName, functionName);
    checkIfObject(input, variableName, fileName, functionName);
    checkLength(input, variableName, fileName, functionName);
}

export { checkStringInput, checkObjectInput }