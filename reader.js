
async function getHtml(tab, fct) {
    // Execute script and return html source code
    try {    
        const result = await chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                function: fct,
            }
        );
        return result[0].result;
    } catch (err) {
        alert('You can\'t use the extension on this tab');
        return null;
    }
}

async function getActiveTab() {
    const tabs = await chrome.tabs.query({ active : true, currentWindow : true });
    const tab = tabs[0];
    return tab;
}

async function getTabContent(tab, html) {
    // Return a dictionnary of the essential information of the tab
    try {
        var content = {};
        content['title'] = tab['title'];
        content['icon'] = tab['favIconUrl'];
        content['url'] = tab['url'];
        content['language'] = await chrome.tabs.detectLanguage(tab);
        var date = html.match(/"datePublished":"[^"]+"/i);
        if (date !== null) {
            content['datePublished'] = date[0].match(/[0-9]+[-/\s][0-9]+[-/\s][0-9]+/g)[0];
        }
        date = html.match(/"dateModified":"[^"]+"/i);
        if (date !== null) {
            content['dateModified'] = date[0].match(/[0-9]+[-/\s][0-9]+[-/\s][0-9]+/g)[0];
        }
        
        content['html'] = html;
        return content;
    } catch (err) {
        alert('Can\'t extract the necessary information about this tab');
    }
    
}

export async function getTab(fct) {
    var tab = await getActiveTab();
    var html = await getHtml(tab, fct);
    var content = await getTabContent(tab, html);
    return content;
}
