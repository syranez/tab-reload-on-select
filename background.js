browser.tabs.onActivated.addListener(activeInfo => {

    browser.tabs.get(activeInfo.tabId, (tab) => {

        if (tab.status === "complete") {
            browser.tabs.reload(activeInfo.tabId);
        }
    });
});
