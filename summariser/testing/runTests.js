import { summarise } from "../summariser.js";
import { testCases } from "./testCases.js";

let results = {};
let modes = ["weak", "medium", "strong"];

// Old
// arsTechnica: 19.12 ms.
// anandTech: 16.50 ms.
// theVerge: 27.01 ms.
// ukraineEnglishWikipediaPage: 4146.09 ms.
// ukraineFrenchWikipediaPage: 622.41 ms.

// New
// arsTechnica: 8.95 ms.
// anandTech: 6.60 ms.
// theVerge: 19.84 ms.
// ukraineEnglishWikipediaPage: 105.67 ms.
// ukraineFrenchWikipediaPage: 32.84 ms.

for(let mode of modes){
    for(let testCase of testCases){
        try{
            let startTime = performance.now();
            let summary = summarise(testCase["content"], testCase["language"], mode);
            let executionTime = performance.now() - startTime;

            let name = `${testCase["name"]}-${mode}-mode`;
            results[name] = 
                        {
                            "executionTime": executionTime.toFixed(2),
                            "errors": [],
                            "summary": summary 
                        }
        } catch(error){
            console.log(error);
            results[testCase["name"]]["errors"].push(error);
        }
    }
}


const checkErrors = (results) =>{
    
    let log = [];

    for(let result in results){
        if(results[result]["errors"].length != 0){
            log.push({
                "name": result,
                "error": results[result]["errors"]
            });
        }
    }

    console.log("\n==== Error Testing ====");
    if(log.length == 0){
        console.log(`All ${testCases.length * modes.length} testCases passed succesfully.`);
    } else{
        console.log(log);
    }
}

const getExecutionTimes = (results) => {
    console.log("\n==== Execution Times ====");
    for(let result in results){
        console.log(`${result}: ${results[result]["executionTime"]} ms.\n`);
    }
}

checkErrors(results);
getExecutionTimes(results);