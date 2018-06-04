/**
 * contains information about the tabs
 *
 * An entry will be deleted on tab closing.
 */
var tabStatusMemoisation = {
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
 * @param Tab tab
 * @return boolean
 */
async function shouldReload (tab) {

    if (typeof tab.url != "undefined"
        && tab.url.startsWith("about:"))
    {
        console.info("shouldReload: No, tab %s shows a about:-page.", tab.id);
        return false;
    }

    if (typeof tab.url != "undefined") {
        if (tab.url.endsWith(".pdf")) {
            console.info("shouldReload: No, tab %s shows a pdf file.", tab.id);
            return false;
        }
    }

    const settings = await getSettings();

    const url  = new URL(tab.url);
    const host = url.hostname;

    if (settings["excludedHosts"].includes(host)) {
        console.info("shouldReload: No, tab %s has host %s that is excluded.", tab.id, host);
        return false;
    }

    if (typeof tabStatusMemoisation[tab.id] == "undefined") {
        console.info("shouldReload: No, tab %s was created before installation of add-on.", tab.id);
        updateTabData(tab.id);
        return false;
    }

    var lastKnownDate = tabStatusMemoisation[tab.id].updated;
    var currentDate   = Date.now();

    var diff      = currentDate - lastKnownDate;
    var threshold = 1000 * 60 * settings.reloadTimeout;

    if (diff > threshold) {
        console.info("shouldReload: Yes, tab %s is old: %ds.", tab.id, diff / 1000);
        return true;
    }

    console.info("shouldReload: No, tab %s is still young: %ds.", tab.id, diff / 1000);
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

    console.info("Tab %s created or updated with timestamp %s.", tabId, timestamp);
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

async function updateIcon (tab) {

    if (typeof tab.url == "undefined") {
        return;
    }

    const settings = await getSettings();

    const url  = new URL(tab.url);
    const host = url.hostname;

    const excluded = settings["excludedHosts"].includes(host);

    browser.browserAction.setIcon({
        path: excluded ? {
            16: "icons/icon_off-plain.svg",
            32: "icons/icon_off-plain.svg"
        } : {
            16: "icons/icon_on-plain.svg",
            32: "icons/icon_on-plain.svg"
        },
        tabId: tab.id
    });

    browser.browserAction.setTitle({
        title: (excluded ? "Enable" : "Disable") + ` tab reload on ${host}.`,
        tabId: tab.id
    });
};

async function toggleDisable (tab) {

    const settings = await getSettings();

    const url  = new URL(tab.url);
    const host = url.hostname;

    if (!settings["excludedHosts"].includes(host)) {
        settings["excludedHosts"].push(host);
        saveSettings(settings);
    } else {
        settings["excludedHosts"] = settings["excludedHosts"].filter(domain => domain !== host)
        saveSettings(settings);
    }

    updateIcon(tab);
};

var extension = {
    shouldReload,
    updateTabData,
    removeTabData,
    updateIcon,
    toggleDisable,
};
