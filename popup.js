import { getHtml, getActiveTab } from './reader.js';
import { simplify } from './simplifier.js';
import { summarise, getUniversalWordsMap } from "./summariser.js";
import { render } from "./engine.js";
import { testCase, headerTestCase } from "./testCases.js";

/*
 * get html
 */
function scrapeThePage() {
    var htmlCode = document.documentElement.outerHTML;
    return htmlCode;
}

/*
 * access session data
 */
function storeData(key, data) {
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

/*
 * event listener
 */
document.addEventListener('DOMContentLoaded', function () {

    /*
     * Simplify
     */
    document.getElementById('simplify').addEventListener('click', async () => {

        var tmp = await getActiveTab();
        var storedTabs = getData('tabs');
        if (storedTabs.length === 0 || !isIn(storedTabs, tmp.url)) {
            storedTabs.push(tmp);
        }

        for (var i = 0; i < storedTabs.length; i++) {
            const html = await getHtml(storedTabs[i], scrapeThePage);
            // call simplifier 
            var dict = simplify(html);
            console.log('dictionnary : ', dict);

            var htmlContent = render(dict, "simplify", headerTestCase);
        
            var newWindow = window.open();
            newWindow.document.write(htmlContent);
        }

        removeData('tabs');

    });

    /*
     * Summariser
     */
    document.getElementById('summarise').addEventListener('click', async () => {
        
        let currentTab = await getActiveTab();
        const html = await getHtml(currentTab, scrapeThePage);
        let dict = simplify(html);

        let language = await chrome.tabs.detectLanguage(currentTab);

        let wordsMap = getUniversalWordsMap(dict, language);

        for(let i = 0; i < dict.length; i++){
            if (dict[i]["p"] !== undefined) {
                dict[i]["p"] = summarise(dict[i]["p"], wordsMap);
            }
        }

        let htmlContent = render(dict, "summarise", headerTestCase);
        let newWindow = window.open();
        newWindow.document.write(htmlContent);

        removeData('tabs');
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