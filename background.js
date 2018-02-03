browser.tabs.onActivated.addListener(activeInfo => {

    browser.tabs.get(activeInfo.tabId, (tab) => {

        if (tab.status !== "complete") {
            return;
        }

        if (typeof tab.url != "undefined"
            && tab.url.startsWith("about:"))
        {
            return;
        }

        browser.tabs.reload(activeInfo.tabId);
    });
});
