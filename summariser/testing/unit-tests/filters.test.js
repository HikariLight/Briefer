import * as filters from "../../filters.js";
import { tokenizeWords } from "../../tokenization.js";

describe("Filters Tests", () =>{

    test("Punctuation filtering", () => {

        const testCase = "This, is( an) example; of' a/ sen\"tence that: needs- filt[ering.";
        const testCaseTokens = tokenizeWords(testCase);
        filters.punctuationFilter(testCaseTokens);
        const expectedResult = tokenizeWords("This is an example of a sentence that needs filtering");

        expect(testCaseTokens).toEqual(expectedResult);
    })

    test("Text filtering", () => {

        const testCase = "This is an example of what this sort of thing should look like.";
        const testCaseTokens = tokenizeWords(testCase);
        const expectedResult = ["example", "sort", "thing", "should", "look", "like"];

        expect(filters.filterText(testCaseTokens, "en")).toEqual(expectedResult);
    })

    test("Sentence filtering", () => {

        const testCase = "In particular, shit happens.";
        const expectedResult = "Shit happens.";

        expect(filters.filterSentence(testCase, "en")).toEqual(expectedResult);
    })

})