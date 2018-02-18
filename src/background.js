browser.tabs.onActivated.addListener(activeInfo => {

    browser.tabs.get(activeInfo.tabId, (tab) => {

        if (typeof tab.id == "undefined") {
            return;
        }

        if (tab.status !== "complete") {
            return;
        }

        if (extension.shouldReload(tab) === false) {
            console.info("Do not reload tab %s.", tab.id);
            return;
        }

        console.info("Reload tab %s.", tab.id);
        extension.updateTabData(tab.id);
        browser.tabs.reload(tab.id);
    });
});

browser.tabs.onCreated.addListener(tab => {

    if (typeof tab.id == "undefined") {
        return;
    }

    extension.updateTabData(tab.id);
});

browser.tabs.onUpdated.addListener(tab => {

    if (typeof tab.id == "undefined") {
        return;
    }

    extension.updateTabData(tab.id);
});

browser.tabs.onRemoved.addListener(tab => {

    if (typeof tab.id == "undefined") {
        return;
    }

    extension.removeTabData(tab.id);
});

extension.loadSettings();
browser.storage.onChanged.addListener(loadSettings)
