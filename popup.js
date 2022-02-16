import { getTab } from './reader.js';
import { simplify } from './simplifier.js';
import { extract } from "./summariser.js";
import { render } from "./engine.js";

/*
 * Ready Html
 */
function scrapeThePage() {
    var htmlCode = document.documentElement.outerHTML;
    return htmlCode;
}

/*
 * Additionnal Function
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
 * Manage Storage
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
 * Main functionality
 */

async function summarize() {
    localStorage.clear();

    // process
    var tab = await getTab(scrapeThePage);

    tab["simplifierRender"] = render(tab, simplify(tab['html']), 'simplify');
    tab["summariserRender"] = render(tab, extract(simplify(tab['html']), tab['language']), 'summarise');
    // delete tab['html'];

    // // storage
    storeData('tabs', tab);
}

function display(htmlContent) {
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
        await summarize();

        // access data
        var data = getData('tabs')[0];

        display(data["simplifierRender"]);

        // wait window.closed === true for removeData('tabs')

    });

    /*
     * Summariser
     */
    document.getElementById('summarise').addEventListener('click', async () => {
        await summarize();

        // access data
        let data = getData('tabs')[0];

        display(data["summariserRender"]);

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