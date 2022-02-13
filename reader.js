
async function getHtml(tab, fct) {
    const result = await chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: fct,
        }
    );
    return result[0].result;
}

async function getActiveTab() {
    // get active tab
    const tabs = await chrome.tabs.query({ active : true, currentWindow : true });
    const tab = tabs[0];
    return tab;
}

async function getHeader(tab, html) {
    var header = {};
    header['title'] = tab['title'];
    header['icon'] = tab['favIconUrl'];
    header['url'] = tab['url'];
    header['language'] = await chrome.tabs.detectLanguage(tab);
    var date = html.match(/"datePublished":"[^"]+"/i);
    if (date !== null) {
        header['datePublished'] = date[0].match(/[0-9]+[-/\s][0-9]+[-/\s][0-9]+/g)[0];
    }
    date = html.match(/"dateModified":"[^"]+"/i);
    if (date !== null) {
        header['dateModified'] = date[0].match(/[0-9]+[-/\s][0-9]+[-/\s][0-9]+/g)[0];
    }
    
    header['html'] = html;
    return header;
}

export async function getTab(fct) {
    var tab = await getActiveTab();
    var html = await getHtml(tab, fct);
    var header = await getHeader(tab, html);
    return header;
}
