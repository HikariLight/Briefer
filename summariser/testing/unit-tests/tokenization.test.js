import * as Tkz from "../../tokenization.js";

describe("Word Tokenization", () => {

    it("Case: Normal", () => {
        expect(Tkz.tokenizeWords("Hello, my name is HikariLight. I'm implementing Unit Testing.")).toEqual(["Hello,", "my", "name", "is", "HikariLight.", "I'm", "implementing", "Unit", "Testing."]);
    })

    it("Case: dash in text", () => {
        expect(Tkz.tokenizeWords("Hello, my name is Hikari-Light. I'm implementing Unit-Testing.")).toEqual(["Hello,", "my", "name", "is", "Hikari", "Light.", "I'm", "implementing", "Unit", "Testing."]);
    })

})

describe("Sentence Tokenization", () => {

    it("Case: Normal", () => {
        expect(Tkz.tokenizeSentences("Hello, my name is HikariLight. I'm implementing Unit Testing.")).toEqual([["Hello,", "my", "name", "is", "HikariLight"], ["I'm", "implementing", "Unit", "Testing"]]);
    })

    it("Case: Edge case (Mr.)", () => {
        expect(Tkz.tokenizeSentences("Hello, my name is Mr. HikariLight. I'm implementing Unit Testing.")).toEqual([["Hello,", "my", "name", "is", "Mr", "HikariLight"], ["I'm", "implementing", "Unit", "Testing"]]);
    })

    it("Case: Edge case large number with period separator", () => {
        expect(Tkz.tokenizeSentences("I heard that 9.000 is a famous number online. It has something to do with Dragon Ball Z.")).toEqual([["I", "heard", "that", "9000", "is", "a", "famous", "number", "online"], ["It", "has", "something", "to", "do", "with", "Dragon", "Ball", "Z"]]);
    })
})