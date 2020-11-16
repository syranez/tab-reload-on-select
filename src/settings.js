/**
 * Persistent settings handling
 *
 */

/**
 * loads and normalize the settings
 *
 * @return object
 */
async function getSettings () {

    let settings = await browser.storage.local.get();

    console.info("Load settings: %o.", settings);

    settings.reloadTimeoutValue = parseInt(settings.reloadTimeoutValue, 10) || 60;
    settings.reloadTimeoutUnit  = settings.reloadTimeoutUnit || "minutes";
    settings.refreshOnReload    = settings.refreshOnReload || false;

    if (typeof settings["excludedHosts"] == "undefined") {
        settings["excludedHosts"] = [];
    }

    if (settings.reloadTimeoutUnit === "hours") {
        settings.reloadTimeout = settings.reloadTimeoutValue * 60;
    } else if (settings.reloadTimeoutUnit === "minutes") {
        settings.reloadTimeout = settings.reloadTimeoutValue;
    }

    console.info('getSettings: ' + JSON.stringify(settings));

    return settings;
}

/**
 * saves the settings
 *
 * @param object settings
 */
function saveSettings (settings) {

    browser.storage.local.set(settings);

    console.info('saveSettings: ' + JSON.stringify(settings));
}
