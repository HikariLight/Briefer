import { checkStringInput, checkObjectInput } from "../exceptionHandling.js";

function scoreCommas(str) {

    // Input : String
    // Output : Number of commas

    checkStringInput(str, "str", "classification.js", "scoreCommas()");

    let pts = str.split(',').length - 1;

    return pts;
}

function scoreCharacters(str) {

    // Input : String
    // Output : Number of times there are 50 characters

    checkStringInput(str, "str", "classification.js", "scoreCharacters()");

    let cp = str;
    cp = cp.replace(/\s|\n/g, '');
    let pts = Math.floor((cp.length / 50));

    return pts;
}

function scoreImages(list, index, score) {

    // Input : Array, Index Number, Score Number
    // Output : If the image is contained between two important contents

    checkObjectInput(list, "list", "classification.js", "scoreImages()");

    let firstCondition = false;
    let secondCondition = false;
    for (let i = 0; i < list.length; i++) {
        if (i < index && list[i][1] >= score) {
            firstCondition = true;
        }
        if (i > index && list[i][1] >= score) {
            secondCondition = true;
        }
    }

    if (firstCondition && secondCondition) {
        return true;
    }
    return false;
}

function scoreNodes(list) {

    // Input : Array of DOM Element
    // Output : Array associated with a score for each Element

    checkObjectInput(list, "list", "classification.js", "scoreNodes()");

    for (let k = 0; k < list.length ; k++) {
        let score = 0;
        if (list[k].localName[0] === 'h') {
            score = 5;
        } else {
            score = 1;
        }
        score += scoreCommas(list[k].textContent);
        score += scoreCharacters(list[k].textContent);

        list[k] = [list[k], score];
    }

    return list;
}

function getTextNode(doc) {

    // Input : DOM Tree 
    // Output : Array of Element that doesn't contains childElement

    checkObjectInput(doc, "doc", "classification.js", "getTextNode()");

    let list = [];
    let collection = doc.getElementsByTagName('*');

    for (let j = 0; j < collection.length; j++) {
        if (collection[j].childElementCount === 0) {
            list.push(collection[j]);
        }
    }

    return list;
}

function verification(list) {

    // Input : Array
    // Output : Array without isolated title

    checkObjectInput(list, "list", "classification.js", "verification()");

    for (let i = list.length - 1; i >= 0; i--) {
        if (new RegExp('h[0-9]').test(list[i].localName)) {
            list.pop();
        } else {
            break;
        }
    }

    return list;
}

function classification(doc) {

    // Input : DOM Element
    // Output : Array of Element corresponding to the main content 

    checkObjectInput(list, "list", "classification.js", "verification()");
    
    let list = getTextNode(doc);

    list = scoreNodes(list);
    
    let res = [];
    let threshold = 3;
    for (let l = 0; l < list.length; l++) {

        if (list[l][1] >= threshold) {
            res.push(list[l][0]);
        }

        if (list[l][0].localName === 'img') {
            if (scoreImages(list, l, threshold)) {
                res.push(list[l][0]);
            }
        }
    }

    // post-processing
    res = verification(res);

    return res;
}

export { classification };