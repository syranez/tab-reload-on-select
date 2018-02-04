var extension = (function () {

    /**
     * contains information about the tabs
     *
     * An entry will be deleted on tab closing.
     */
    tabStatusMemoisation = {
        /* example entry
         *
         * tabId = {
         *     "updated" = Timestamp of (re-)load date
         * }
         */
    };

    /**
     * checks if a tab should be reloaded.
     *
     * A tab should be reloaded if updated is more than an hour ago.
     * Otherwise it should not be reloaded.
     *
     * @param string tabId
     * @return boolean
     */
    function shouldReload (tabId) {

        if (typeof tabStatusMemoisation[tabId] == "undefined") {
            console.info("shouldReload: No, tab %s was created before installation of add-on.", tabId);
            updateTabData(tabId);
            return false;
        }

        var lastKnownDate = tabStatusMemoisation[tabId].updated;
        var currentDate   = Date.now();

        var diff      = currentDate - lastKnownDate;
        var threshold = 1000 * 60 * 60; /* 60 Minutes */

        if (diff > threshold) {
            console.info("shouldReload: Yes, tab %s is old: %ds.", tabId, diff / 1000);
            return true;
        }

        console.info("shouldReload: No, tab %s is still young: %ds.", tabId, diff / 1000);
        return false;
    };

    /**
     * updates the last reload time
     *
     * @param string tabId
     * @return undefined
     */
    function updateTabData (tabId) {

        var timestamp = Date.now();

        tabStatusMemoisation[tabId] = {
            "updated": timestamp
        };
    };

    /**
     * removes an entry
     *
     * @param string tabId
     * @return undefined
     */
    function removeTabData (tabId) {

        if (typeof tabStatusMemoisation[tabId] != "undefined") {
            delete tabStatusMemoisation[tabId];
            console.info("Removed tab %s .", tabId);
        }
    };

    return {
        shouldReload,
        updateTabData,
        removeTabData
    };
})();

browser.tabs.onActivated.addListener(activeInfo => {

    browser.tabs.get(activeInfo.tabId, (tab) => {

        if (typeof tab.id == "undefined") {
            return;
        }

        if (tab.status !== "complete") {
            return;
        }

        if (typeof tab.url != "undefined"
            && tab.url.startsWith("about:"))
        {
            return;
        }

        if (extension.shouldReload(tab.id) === false) {
            console.info("Do not reload tab %s because it is too young.", tab.id);
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

    console.info("Tab %s created with updated timestamp %d.", tab.id, timestamp);
});

browser.tabs.onUpdated.addListener(tab => {

    if (typeof tab.id == "undefined") {
        return;
    }

    extension.updateTabData(tab.id);

    console.info("Tab %s updated with updated timestamp %d.", tab.id, timestamp);
});

browser.tabs.onRemoved.addListener(tab => {

    if (typeof tab.id == "undefined") {
        return;
    }

    extension.removeTabData(tab.id);
});
