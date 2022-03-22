import { summarise } from "../summariser.js";
import { testCases } from "./testCases.js";
import {getArticleLength, getReductionRate } from "./tools.js";

let results = {};
let errorLog = [];

for(let testCase of testCases){

    try{

        let startTime = performance.now();
        let summary = summarise(testCase["content"], testCase["language"]);
        let executionTime = performance.now() - startTime;

        let reductionRate = getReductionRate(testCase["length"], getArticleLength(summary));

        results[testCase["name"]] = 
                    {
                        "executionTime": executionTime.toFixed(2),
                        "reductionRate": reductionRate.toFixed(2),
                        "summary": summary 
                    }
    } catch(error){
        errorLog.push([testCase["name"], error]);
    }
}

const checkErrors = (errorLog) =>{
    console.log("\n===== Error Testing ===== ");
    if(errorLog.length == 0){
        console.log(`All ${testCases.length} test cases passed succesfully.`);
    } else{
        console.log(errorLog);
    }
}

const getExecutionTimes = (results) => {
    console.log("\n===== Execution Times ===== ");
    for(let result in results){
            console.log(`${result}: ${results[result]["executionTime"]} ms.`);
    }
}

const getReductionResults = (results) => {
    console.log("\n===== Effectiveness rates ===== ");
    for(let result in results){
        console.log(`${result}'s length has been reduced by ${results[result]["reductionRate"]}%.`);
    }
}

getExecutionTimes(results);
getReductionResults(results);
checkErrors(errorLog);