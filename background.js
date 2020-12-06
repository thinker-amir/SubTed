const INTERVAL = 50;
const SUBTITLE_ELEMENT_QUERY = "#ted-player .bg\\:black\\.3 span"
let intervalID;

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "apply") {
            clearInterval(intervalID);
            intervalID = setInterval(injectStyles.bind(null, request['styles']), INTERVAL);
        }
    }
);

function injectStyles(styles) {
    const subtitleElement = document.querySelector(SUBTITLE_ELEMENT_QUERY);
    if (isAvailableSubtitle(subtitleElement)) {
        const backgroundColor = hexToRgba(styles.subtitleBackground, styles.subtitleBackgroundAlpha)
        subtitleElement.style.fontSize = `${styles.fontSize}px`
        subtitleElement.style.color = `${styles.subtitleColor}`
        subtitleElement.parentElement.style.backgroundColor = backgroundColor;
    }
}

function isAvailableSubtitle(element) {
    return element !== null;
}

function hexToRgba(hex, alpha) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)
    return result ? `rgba(${r},${g},${b},${alpha})` : null;
}