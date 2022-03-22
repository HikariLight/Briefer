import { checkStringInput, checkObjectInput } from "../exceptionHandling.js";

const unexpectedWebsite = ['https://www.facebook.com', 'https://web.whatsapp.com', 'https://www.instagram.com', 'https://www.tiktok.com', 'https://www.snapchat.com', 'https://www.reddit.com', 'https://www.pinterest.com', 'https://twitter.com', 'https://www.linkedin.com', 'https://www.youtube.com', 'https://www.dailymotion.com', 'chrome://', 'file://', 'chrome-extension://'];

async function getHtml (tab, fct) {
    
    // Input : Tab object, scraping function (cf popup.js)
    // Output : String (html)

    checkObjectInput(tab, "tab", "reader.js", "getHtml()");
    
    if ( new RegExp(unexpectedWebsite.join('|')).test(tab.url) || tab.url === '') {
        throw {
            name : 'Warning', message : 'Cannot process an unexpected URL\r\nMore details on our website : \r\n\r\nhttps://briefer.netlify.app/faq'
        }
    }
    try {
        const data = await fetch(tab.url, {})
        .then( (response) => {
            if (response.status === 200) {
                return response.text()
            } else {
                throw Error('Something went wrong ;(')
            }
        })
        .then( (html) => {
            return html
        })
        .catch( (error) => {
            console.log('[error] Failed : ', error)
        });

        return data;
    } finally {
        const result = await chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                function: fct,
            }
        );
        return result[0].result;
    }
}

async function getActiveTab () {

    // Output : Active Tab object

    const tabs = await chrome.tabs.query({ active : true, currentWindow : true });
    const tab = tabs[0];
    return tab;
}

async function getTabContent(tab, html) {

    // Input : Tab Object, Html String
    // Output : Dictionnary [title, icon, url, language, datePublished, dateModified, html]

    checkObjectInput(tab, "tab", "reader.js", "getTabContent()");
    checkStringInput(html, "html", "reader.js", "getTabContent()");

    let content = {};

    content['title'] = tab['title'];
    content['icon'] = tab['favIconUrl'];
    content['url'] = tab['url'];
    content['language'] = await chrome.tabs.detectLanguage(tab);

    let date = html.match(/"datePublished":"[^"]+"/i);
    if ( date !== null ) {
        content['datePublished'] = date[0].match(/[0-9]+[-/\s][0-9]+[-/\s][0-9]+/g)[0];
    }

    date = html.match(/"dateModified":"[^"]+"/i);
    if ( date !== null ) {
        content['dateModified'] = date[0].match(/[0-9]+[-/\s][0-9]+[-/\s][0-9]+/g)[0];
    }
        
    content['html'] = html;

    return content;
    
}

export async function getTab(fct) {

    // Input : Scraping function
    // Output : Dictionnary

    let content = {};

    let tab = await getActiveTab();
    let html = await getHtml(tab, fct);
    content = await getTabContent(tab, html);

    return content;
}
