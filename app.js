import {LoadImages} from "./loader.js";

const sources = [
    "images/Free Creative Business Flatlay by Burst_02.jpg",
    "images/Free Creative Business Flatlay by Burst_03.jpg",
    "images/Free Creative Business Flatlay by Burst_05.jpg",
    "images/Free Creative Business Flatlay by Burst_07.jpg",
    "images/Free Creative Business Flatlay by Burst_08.jpg",
];




(async () => {
    const DOM = {};
    DOM.bar = document.querySelector(".progress");
    DOM.progress = document.querySelector(".progress-bar");
    DOM.text = document.querySelector(".progress-bar-text");
    DOM.gallery = document.querySelector(".gallery")

    const loader = new LoadImages(sources);
    loader.onLoadImage = ({url, bytesLoaded, bytesLoadedAll, bytesAll, progressAll}) => {
        console.warn({url, bytesLoaded, bytesLoadedAll, progressAll});
    }
    loader.onProgressImage = ({url, progressImg, bytesLoadedImg, bytesLoadedAll, bytesAll, progressAll}) => {
        console.log({url, progressImg, bytesLoadedImg, bytesLoadedAll, progressAll});
        DOM.progress.style.width = `${progressAll.toFixed(2)}%`
        DOM.text.innerText = `${progressAll.toFixed(2)}% (${bytesLoadedAll.toFixed(2)} / ${bytesAll.toFixed(2)} bytes)`
    }
    await loader.init()
    try {
        await loader.startLoading();
    } catch(err) {
        console.log(err);
    }
})();
