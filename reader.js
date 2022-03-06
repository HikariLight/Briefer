
const unexpectedWebsite = ['https://www.facebook.com', 'https://web.whatsapp.com', 'https://www.instagram.com', 'https://www.tiktok.com', 'https://www.snapchat.com', 'https://www.reddit.com', 'https://www.pinterest.com', 'https://twitter.com', 'https://www.linkedin.com', 'https://www.youtube.com', 'https://www.dailymotion.com'];

async function getHtml(tab, fct) {
    // Execute script and return html source code
    if (typeof(tab) !== 'object') {

        throw 'Reader Error :\ngetHtml() error. Wrong input type.\nTab type given : ' + typeof(tab);
    
    } else if ( new RegExp(unexpectedWebsite.join('|')).test(tab.url) ) {

        throw 'Error: Cannot access an unexpected URL';

    }

    const result = await chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: fct,
        }
    );
    return result[0].result;
}

async function getActiveTab() {
    const tabs = await chrome.tabs.query({ active : true, currentWindow : true });
    const tab = tabs[0];
    return tab;
}

async function getTabContent(tab, html) {
    // Return a dictionnary of the essential information of the tab    
    if (typeof(tab) !== 'object') {
        throw 'Reader Error :\ngetTabContent() error. Wrong input type.\nTab type given : ' + typeof(tab);
    }

    if(html == null || html.length == 0 ){
        throw 'Reader Error :\ngetTabContent() error. Empty HTML.';
    }

    if(typeof(html) != 'string'){
        throw 'Reader Error :\ngetTabContent() error. Wrong input type.\nHTML type given : ' + typeof(html);
    } 

    let content = {};
    content['title'] = tab['title'];
    content['icon'] = tab['favIconUrl'];
    content['url'] = tab['url'];
    content['language'] = await chrome.tabs.detectLanguage(tab);
    let date = html.match(/"datePublished":"[^"]+"/i);
    if (date !== null) {
        content['datePublished'] = date[0].match(/[0-9]+[-/\s][0-9]+[-/\s][0-9]+/g)[0];
    }
    date = html.match(/"dateModified":"[^"]+"/i);
    if (date !== null) {
        content['dateModified'] = date[0].match(/[0-9]+[-/\s][0-9]+[-/\s][0-9]+/g)[0];
    }
        
    content['html'] = html;
    return content;
    
}

export async function getTab(fct) {
    let content = {};
    try {
        let tab = await getActiveTab();
        let html = await getHtml(tab, fct);
        content = await getTabContent(tab, html);
    } catch (err) {
        alert(err);
    }

    return content;
}
