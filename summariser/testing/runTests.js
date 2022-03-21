import { summarise } from "../summariser.js";
import { testCases } from "./testCases.js";
import {getArticleLength, getReductionRate } from "./tools.js";

let modes = ["weak", "medium", "strong"];
let results = {};
let errorLog = [];

for(let testCase of testCases){
    
    results[testCase["name"]] = {}

    for(let mode of modes){
        try{

            let startTime = performance.now();
            let summary = summarise(testCase["content"], testCase["language"], mode);
            let executionTime = performance.now() - startTime;

            let reductionRate = getReductionRate(testCase["length"], getArticleLength(summary));

            results[testCase["name"]][mode] = 
                        {
                            "executionTime": executionTime.toFixed(2),
                            "reductionRate": reductionRate.toFixed(2),
                            "summary": summary 
                        }
        } catch(error){
            errorLog.push([testCase["name"], mode, error]);
        }
    }
}

const checkErrors = (errorLog) =>{
    console.log("\n===== Error Testing ===== ");
    if(errorLog.length == 0){
        console.log(`All ${testCases.length * modes.length} test cases passed succesfully.`);
    } else{
        console.log(errorLog);
    }
}

const getExecutionTimes = (results) => {
    console.log("\n===== Execution Times ===== ");
    for(let result in results){
        console.log(`\n--- ${result} ---`)
        for(let mode of modes){
            console.log(`${mode}: ${results[result][mode]["executionTime"]} ms.`);
        }
    }
}

const getReductionResults = (results) => {
    console.log("\n===== Effectiveness Times ===== ");
    for(let result in results){
        console.log(`\n--- ${result} ---`)
        for(let mode of modes){
            console.log(`${mode}: Article Length reduced by ${results[result][mode]["reductionRate"]}%.`);
        }
    }
}

getExecutionTimes(results);
// getReductionResults(results);
checkErrors(errorLog);