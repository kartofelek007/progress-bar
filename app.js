import {LoadImages} from "./loader.js";

const sources = [
    "images/Free Creative Business Flatlay by Burst_02.jpg",
    "images/Free Creative Business Flatlay by Burst_03.jpg",
    "images/Free Creative Business Flatlay by Burst_05.jpg",
    "images/Free Creative Business Flatlay by Burst_07.jpg",
    "images/Free Creative Business Flatlay by Burst_08.jpg",
    "images/NordWood-9703.jpg",
    "images/NordWood-9710.jpg",
    "images/NordWood-9732.jpg",
    "images/NordWood-9743.jpg",
    "images/NordWood-9756.jpg",
    "images/NordWood-9762.jpg",
    "images/NordWood-9795.jpg",
    "images/NordWood-9811.jpg",
    "images/NordWood-9826.jpg",
    "images/NordWood-9852.jpg",
    "images/NordWood-9878.jpg",
];

const DOM = {};
DOM.bar = document.querySelector(".progress");
DOM.progress = document.querySelector(".progress-bar");
DOM.text = document.querySelector(".progress-bar-text");
DOM.gallery = document.querySelector(".gallery");
DOM.detail = document.querySelector(".progress-details");

(async () => {
    const loader = new LoadImages(sources);
    loader.beforeLoading = ({bytesAll, allFilesStatus}) => {
        allFilesStatus.forEach(file => {
            const bar = document.createElement("div");
            bar.classList.add("progress");
            const progress = document.createElement("div");
            progress.classList.add("progress-bar");
            const text = document.createElement("div");
            text.classList.add("progress-bar-text");
            text.innerText = file.url;
            bar.append(progress);
            bar.append(text);
            bar.dataset.url = file.url;
            DOM.detail.append(bar);
        })
    }

    loader.onLoadImage = ({img, url, bytesLoaded, bytesLoadedAll, bytesAll, progressAll, allFilesStatus}) => {
        console.warn({img, url, bytesLoaded, bytesLoadedAll, progressAll});
        DOM.gallery.append(img);
    }

    loader.onProgressImage = ({url, progressImg, bytesLoadedImg, bytesLoadedAll, bytesAll, progressAll, allFilesStatus}) => {
        console.log({url, progressImg, bytesLoadedImg, bytesLoadedAll, progressAll});
        DOM.progress.style.width = `${progressAll.toFixed(2)}%`
        DOM.text.innerText = `${progressAll.toFixed(2)}% (${bytesLoadedAll.toFixed(2)} / ${bytesAll.toFixed(2)} bytes)`
        allFilesStatus.forEach(file => {
            const bar = DOM.detail.querySelector(`.progress[data-url="${file.url}"]`);
            const progress = bar.querySelector(".progress-bar");
            const text = bar.querySelector(".progress-bar-text");
            progress.style.width = `${file.download / file.size * 100}%`;
            text.innerText = `${file.download / file.size * 100}% - ${file.url} - (${file.download} / ${file.size} bytes)`;
        })
    }
    loader.afterLoading = ({bytesAll, allFilesStatus}) => {
        console.log({bytesAll, allFilesStatus})
    }

    await loader.prepareLoading()
    await loader.startLoading();
})();
