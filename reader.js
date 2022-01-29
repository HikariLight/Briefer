
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