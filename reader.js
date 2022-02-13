
export async function getHtml(tab, fct) {
    const result = await chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: fct,
        }
    );
    return result[0].result;
}

export async function getActiveTab() {
    // get active tab
    const tabs = await chrome.tabs.query({ active : true, currentWindow : true });
    const tab = tabs[0];
    return tab;
}

export async function getHeader(tab, html) {
    var header = {};

    header['title'] = tab['title'];
    header['icon'] = tab['favIconUrl'];
    header['url'] = tab['url'];
    header['language'] = await chrome.tabs.detectLanguage(tab);
    var date = html.match(/"datePublished":"[^"]+"/i)[0];
    if (date !== null) {
        header['datePublished'] = date.match(/[0-9]+[-/\s][0-9]+[-/\s][0-9]+/g)[0];
    }

    date = html.match(/"dateModified":"[^"]+"/i)[0];
    if (date !== null) {
        header['dateModified'] = date.match(/[0-9]+[-/\s][0-9]+[-/\s][0-9]+/g)[0];
    }

    return header;
}
