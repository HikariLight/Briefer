import * as mapper from "../../../summariser/mapping";

describe("Words Map", () => {

    test("Case: Normal", () => {

        const testCase = "Hello, my name is HikariLight. I'm implementing Unit Testing.";
        const testCaseLang = "en"
        const expectedResult = {
            Hello: 1,
            my: 1,
            name: 1,
            HikariLight: 1,
            Im: 1,
            implementing: 1,
            Unit: 1,
            Testing: 1
        };

        expect(mapper.getWordsMap(testCase, testCaseLang)).toEqual(expectedResult);
    })
})

describe("Sentence Map", () => {
    test("Case: Normal", () => {

        const testCase = "Hello, my name is HikariLight. I'm implementing Unit Testing. This is quite fun";
        const expectedResult = {
            'Hello, my name is HikariLight': 0,
            "I'm implementing Unit Testing": 0,
            'This is quite fun': 0
        };

        expect(mapper.getSentenceMap(testCase)).toEqual(expectedResult);
    })
})