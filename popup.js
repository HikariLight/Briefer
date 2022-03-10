import { getTab } from './reader.js';
import { simplify } from './simplifier.js';
import { extract } from "./summariser/summariser.js";
import { renderPage, renderErrorPage } from "./html-engine/renderEngine.js";

function scrapeThePage() {
    // Function used bu reader.js but need to be here to get the html source code
    let htmlCode = document.documentElement.outerHTML;
    return htmlCode;
}

//
//  MANAGE LOCAL STORAGE 
//

function storeData(key, data) {
    // Store data inside a list
    let current = localStorage.getItem(key);
    if (!current) {
        current = [];
    } else {
        current = JSON.parse(current);
    }
    current.push(data);

    try {
        localStorage.setItem(key, JSON.stringify(current));
        console.log('data stored');
    } catch (e) {
        console.log('[ERROR] ', e);
        let _lsTotal=0,_xLen,_x;for(_x in localStorage){ if(!localStorage.hasOwnProperty(_x)){continue;} _xLen= ((localStorage[_x].length + _x.length)* 2);_lsTotal+=_xLen; console.log(_x.substr(0,50)+" = "+ (_xLen/1024).toFixed(2)+" KB")};console.log("Local Storage Size = " + (_lsTotal / 1024).toFixed(2) + " KB");
        alert('Local Storage is full, Please empty data');
    }
    
}

function removeData(key) {
    localStorage.removeItem(key);
}

function getData(key) {
    // Return an array of data
    let current = localStorage.getItem(key);
    if (!current) {
        current = [];
    } else {
        current = JSON.parse(current);
    }
    return current;
}

//
//  MAIN FUNCTIONNALITY
//  

const getLatestPageId = () =>{

    let result = 0;

    for(let key in localStorage){
        if(parseInt(key) > result){
            result = parseInt(key);
        }
    }

    return result;
}

async function processing() {
    // Generate render of simplify and summary content

    let tab = await getTab(scrapeThePage);

    let simply = simplify(tab['html']);

    let pageId = getLatestPageId() + 1;
    tab["pageId"] = pageId.toString();

    tab["simplifierRender"] = renderPage(tab, simply, 'simplify');
    tab["summariserRender"] = renderPage(tab, extract(simply, tab['language']), 'summarise');
    delete tab['html'];

    storeData(tab["pageId"], tab);

    
    
}

function display(htmlContent) {
    let newWindow = window.open();
    newWindow.document.write(htmlContent);
}

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('simplify').addEventListener('click', async () => {
        try {

            await processing();

            let pageId = getLatestPageId();
            let data = getData(pageId.toString())[0];

            display(data["simplifierRender"]);

        } catch (err) {

            if ( err.name === 'Warning' ) {
                alert(err.message);
            } else {
                console.warn('['+err.name+'] '+ err.message + '\n' + err.fileName + ', '+err.functionName +', line ' + err.lineNumber);
            }

            display(renderErrorPage(err));
        }

    });

    document.getElementById('summarise').addEventListener('click', async () => {

        try {

            await processing();

            let pageId = getLatestPageId();
            let data = getData(pageId.toString())[0];

            display(data["summariserRender"]);

        } catch (err) {

            if ( err.name === 'Warning' ) {
                alert(err.message);
            } else {
                console.warn('['+err.name+'] '+ err.message + '\n' + err.fileName + ', '+err.functionName +', line ' + err.lineNumber);
            }

            display(renderErrorPage(err));
        }

    });

    // document.getElementById('remember').addEventListener('click', async () => {
    //     storeData('tabs', await getActiveTab());
    // });

    // document.getElementById('dashboard').addEventListener('click', async () => {
    //     alert('not implemented yet');
    // });
});