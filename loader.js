export class LoadImages {
    constructor(sources) {
        this.sources = sources;
        this.sourceVerified = [];
        this.sizeAll = 0;
        this.sizeLoaded = 0;
        this.progress = 0;
        this.sizeActual = 0;
        this.onProgressImage = () => {};
        this.onLoadImage = () => {};
    }

    getFileSize(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("HEAD", url, true);
            xhr.onreadystatechange = function() {
                if (this.readyState === this.DONE) {
                    if (xhr.getResponseHeader("Content-Length")) {
                        resolve({
                            url,
                            size: parseInt(xhr.getResponseHeader("Content-Length"))
                        });
                    } else {
                        resolve({url, size: 0}); //błąd wczytywania pliku więc nie ma wielkości contentu
                    }

                }
            };
            xhr.onerror = () => {
                reject({url, size: 0});
            }
            xhr.send(null);
        })
    }

    async calculateEntireSize() {
        for (let url of this.sources) {
            let fileData = await this.getFileSize(url);
            if (fileData.size) {
                this.sourceVerified.push({url, size: fileData.size});
                this.sizeAll += fileData.size;
            }
        }
        this.sizeActual = this.sizeAll;
        this.sizeLoaded = this.sizeAll;
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let load = 0;
            xhr.responseType = "blob";
            xhr.open("get", url, true);
            xhr.onprogress = (event) => {
                this.sizeActual = this.sizeLoaded - event.loaded;
                this.onProgressImage({
                    url : url,
                    progressImg : event.loaded / event.total * 100,
                    bytesLoadedImg : event.loaded,
                    bytesLoadedAll : this.sizeAll - this.sizeActual,
                    bytesAll : this.sizeAll,
                    progressAll : 100 - (this.sizeActual / this.sizeAll * 100)
                });
            };
            xhr.onload = (event) => {
                const urlCreator = window.URL || window.webkitURL;
                const url = urlCreator.createObjectURL(xhr.response);
                this.sizeLoaded -= event.loaded;
                const img = new Image();
                img.src = url;
                this.onLoadImage({
                    url,
                    bytesLoaded: event.loaded,
                    bytesLoadedAll : this.sizeActual,
                    bytesAll : this.sizeAll,
                    progressAll : 100 - (this.sizeActual / this.sizeAll * 100)
                });
                this.onProgressImage({
                    url : url,
                    progressImg : event.loaded / event.total * 100,
                    bytesLoadedImg : event.loaded,
                    bytesLoadedAll : this.sizeAll - this.sizeActual,
                    bytesAll : this.sizeAll,
                    progressAll : 100 - (this.sizeActual / this.sizeAll * 100)
                });
                resolve(url);
            }
            xhr.onerror = (event) => {
                reject(url, event.status)
            }
            xhr.send(null);
        })
    }

    async init() {
        await this.calculateEntireSize();
    }

    async startLoading() {
        for (let url of this.sources) {
            if (this.sourceVerified.findIndex(el => el.url === url) !== -1) {
                this.loadImage(url);
            }
        }
    }
}


