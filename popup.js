import { getHtml, getActiveTab } from './reader.js';

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

        var tmp = await reader.getActiveTab();
        var storedTabs = getData('tabs');
        if (storedTabs.length === 0 || !isIn(storedTabs, tmp.url)) {
            storedTabs.push(tmp);
        }

        for (var i = 0; i < storedTabs.length; i++) {
            const html = await getHtml(storedTabs[i], scrapeThePage);
            console.log('html : ', i+1, ' = ', html);
            // call simplifier here
        }

        removeData('tabs');

    });

    /*
     * Summariser
     */
    document.getElementById('summarise').addEventListener('click', async () => {
        alert('not implemented yet');
    });

    /*
     * Remember Pages
     */
    document.getElementById('remember').addEventListener('click', async () => {
        storeData('tabs', await getActiveTab());
    });

    /*
     * Dashboard
     */
    document.getElementById('dashboard').addEventListener('click', async () => {
        alert('not implemented yet');
    });
});