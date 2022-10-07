import * as tokenizer from "../../../summariser/tokenization";

describe("Word Tokenization", () => {

    test("Case: Normal", () => {
        expect(tokenizer.tokenizeWords("Hello, my name is HikariLight. I'm implementing Unit Testing.")).toEqual(["Hello,", "my", "name", "is", "HikariLight.", "I'm", "implementing", "Unit", "Testing."]);
    })

    test("Case: dash in text", () => {
        expect(tokenizer.tokenizeWords("Hello, my name is Hikari-Light. I'm implementing Unit-Testing.")).toEqual(["Hello,", "my", "name", "is", "Hikari", "Light.", "I'm", "implementing", "Unit", "Testing."]);
    })

})

describe("Sentence Tokenization", () => {

    test("Case: Normal", () => {
        expect(tokenizer.tokenizeSentences("Hello, my name is HikariLight. I'm implementing Unit Testing.")).toEqual([["Hello,", "my", "name", "is", "HikariLight"], ["I'm", "implementing", "Unit", "Testing."]]);
    })

    test("Case: Edge case: Mr.", () => {
        expect(tokenizer.tokenizeSentences("Hello, my name is Mr. HikariLight. I'm implementing Unit Testing.")).toEqual([["Hello,", "my", "name", "is", "Mr", "HikariLight"], ["I'm", "implementing", "Unit", "Testing."]]);
    })

    test("Case: Edge case large number with period separator", () => {
        expect(tokenizer.tokenizeSentences("I heard that 9.000 is a famous number online. It has something to do with Dragon Ball Z.")).toEqual([["I", "heard", "that", "9000", "is", "a", "famous", "number", "online"], ["It", "has", "something", "to", "do", "with", "Dragon", "Ball", "Z"]]);
    })
})