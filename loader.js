export class LoadImages {
    constructor(sources) {
        this.sources = sources;
        this.sourceVerified = [];
        this.progress = 0;

        this.onProgressImage = () => {};
        this.onLoadImage = () => {};
        this.beforeLoading = () => {};
        this.afterLoading = () => {};
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

    async generateSources() {
        for (let url of this.sources) {
            let fileData = await this.getFileSize(url);
            if (fileData.size) {
                this.sourceVerified.push({
                    url,
                    size: fileData.size,
                });
                this.sizeAll += fileData.size;
            }
        }
    }

    getAllDownload() {
        if (!this.sourceVerified.length) return 0;
        let size = 0;
        for (let source of this.sourceVerified) {
            size += source.download;
        }
        return size;
    }

    getAllSize() {
        let size = 0;
        for (let source of this.sourceVerified) {
            size += source.size;
        }
        return size;
    }

    getVerifiedSource(url) {
        return this.sourceVerified.find(el => el.url === url);
    }

    loadImage(url) {
        const source = this.getVerifiedSource(url);
        if (!source) Promise.reject(null);

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.open("get", url, true);
            xhr.onprogress = (event) => {
                source.download = event.loaded;

                const actualAllDownload = this.getAllDownload();
                const sizeAll = this.getAllSize();

                this.onProgressImage({
                    url : url,
                    progressImg : event.loaded / event.total * 100,
                    bytesLoadedImg : event.loaded,
                    bytesLoadedAll : actualAllDownload,
                    bytesAll : sizeAll,
                    progressAll : actualAllDownload / sizeAll * 100,
                    allFilesStatus : [...this.sourceVerified]
                });
            };
            xhr.onload = (event) => {
                const urlCreator = window.URL || window.webkitURL;
                const url = urlCreator.createObjectURL(xhr.response);
                const img = new Image();
                img.src = url;

                const actualAllDownload = this.getAllDownload();
                const sizeAll = this.getAllSize();

                this.onLoadImage({
                    img,
                    url,
                    bytesLoaded: event.loaded,
                    bytesLoadedAll : actualAllDownload,
                    bytesAll : this.sizeAll,
                    progressAll : actualAllDownload / sizeAll * 100,
                    allFilesStatus : [...this.sourceVerified]
                });
                this.onProgressImage({
                    url : url,
                    progressImg : event.loaded / event.total * 100,
                    bytesLoadedImg : event.loaded,
                    bytesLoadedAll : actualAllDownload,
                    bytesAll : sizeAll,
                    progressAll : actualAllDownload / sizeAll * 100,
                    allFilesStatus : [...this.sourceVerified]
                });
                resolve(url);
            }
            xhr.onerror = (event) => {
                reject(url, event.status)
            }
            xhr.send(null);
        })
    }

    async prepareLoading() {
        await this.generateSources();
        for (let file of this.sourceVerified) {
            file.download = 0;
        }
    }

    startLoading() {
        this.beforeLoading({
            bytesAll : this.sizeAll,
            allFilesStatus : [...this.sourceVerified]
        })
        for (let url of this.sources) {
            if (this.sourceVerified.findIndex(el => el.url === url) !== -1) {
                this.loadImage(url);
            }
        }
        this.afterLoading({
            bytesAll : this.sizeAll,
            allFilesStatus : [...this.sourceVerified]
        })
    }
}


