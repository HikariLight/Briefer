import { extract } from "../summariser.js";
import { testCases } from "./testCases.js";

let results = {};

for(let testCase of testCases){
    try{
        let startTime = performance.now();
        let extraction = extract(testCase["content"], testCase["language"]);
        let executionTime = performance.now() - startTime;
        results[testCase["name"]] = 
                    {
                        "executionTime": executionTime.toFixed(2),
                        "errors": [],
                        "extraction": extraction 
                    }
    } catch(error){
        results[testCase["name"]]["errors"].push(error);
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
        console.log(`All ${testCases.length} testCases passed succesfully.`);
    } else{
        console.log(log);
    }
}

const getExecutionTimes = (results) => {
    console.log("\n==== Execution Times ====");
    for(let result in results){
        console.log(`${result}: ${results[result]["executionTime"]} ms.`);
    }
}

checkErrors(results);
getExecutionTimes(results);