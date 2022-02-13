import { getTab } from './reader.js';
import { simplify } from './simplifier.js';
import { summarise, getUniversalWordsMap } from "./summariser.js";
import { render } from "./engine.js";
// import { testCase, headerTestCase } from "./testCases.js";

/*
 * get html
 */
function scrapeThePage() {
    var htmlCode = document.documentElement.outerHTML;
    return htmlCode;
}

/*
 * Additionnal function
 */
function isIn(arr, url) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].url  === url) {
            return true;
        }
    }
    return false;
}

/* function storeData(key, data) {
    var current = window.localStorage.getItem(key);
    if (!current) {
        current = [];
    } else {
        current = JSON.parse(current);
    }
    current.push(data);
    window.localStorage.setItem(key, JSON.stringify(current));
    console.log('data stored');
}

function removeData(key) {
    window.localStorage.removeItem(key);
}

function getData(key) {
    var current = window.localStorage.getItem(key);
    if (!current) {
        current = [];
    } else {
        current = JSON.parse(current);
    }
    return current;
} */

/*
 * Main functionality
 */

function display(tab, dict, functionality) {
    var htmlContent = render(tab, dict, functionality);
    var newWindow = window.open();
    newWindow.document.write(htmlContent);
}

/*
 * event listener
 */
document.addEventListener('DOMContentLoaded', function () {

    /*
     * Simplify
     */
    document.getElementById('simplify').addEventListener('click', async () => {

        var currentTab = await getTab(scrapeThePage);

        var dict = simplify(currentTab['html']);
        console.log('dictionnary : ', dict);

        display(currentTab, dict, 'simplify');

    });

    /*
     * Summariser
     */
    document.getElementById('summarise').addEventListener('click', async () => {
        
        let currentTab = await getTab(scrapeThePage);
        let dict = simplify(currentTab['html']);

        /// we should include this part directly inside the summariser 
        /// indeed, it's more appropriate
        /// More over, if we want to switch between simplify <--> summarizer, we can't modify dict
        let wordsMap = getUniversalWordsMap(dict, currentTab['language']);
        for(let i = 0; i < dict.length; i++){
            if (dict[i]["p"] !== undefined) {
                dict[i]["p"] = summarise(dict[i]["p"], wordsMap);
            }
        }

        display(currentTab, dict, 'summarise');

    });

    /*
     * Remember Pages
     */
    // document.getElementById('remember').addEventListener('click', async () => {
    //     storeData('tabs', await getActiveTab());
    // });

    // /*
    //  * Dashboard
    //  */
    // document.getElementById('dashboard').addEventListener('click', async () => {
    //     alert('not implemented yet');
    // });
});