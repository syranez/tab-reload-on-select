# Tab reload on select

This Firefox-Add-on reloads a selected tab to get fresh content.

## Smart Reload

The add-on never reloads about-Pages.

The add-on reloads only pages which are unreloaded for an hour (default setting)

The add-on never reloads PDFs.

## Exclude Host

The add-on adds a button to the browser's toolbar. The button activates and deactivates tab reload on the domain of the URL.

The button has a colorized hourglass if tab reload is active on the domain.
Otherwise the icon is a grey x.

## Configuration

The reload timeout value is configurable in the preferences panel on the about:addons-page (default: 60 minutes).

## Ressources

https://developer.chrome.com/extensions/tabs
https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/browserAction
