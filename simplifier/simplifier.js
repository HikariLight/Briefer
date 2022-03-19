import { checkStringInput } from "../exceptionHandling.js";
import { preProcess } from "./preProcessing.js";
import { classification } from "./classification.js";
import { dataFormatting } from "./dataFormatting.js";

function simplify(html) {

    // Input : Html String
    // Output : Array of most important string divided by tag and section

    checkStringInput(html, "html", "simplifier.js", "simplify()");

    // convert string into DOM Element
    const parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');

    // add deep cloning 
    // var doc_copy = Object.assign( {}, doc);

    // Pre-processing
    preProcess(doc);
    console.log('[pre-processing] : ',doc);

    // Classification
    let list = classification(doc);
    console.log('[classification] : ', list);

    // Data formatting
    let output = dataFormatting(list);
    console.log('[data formatting] : ', output);

    return output;
}

export { simplify };