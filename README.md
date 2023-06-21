# Loading bar
Dynamic loading bar for images.

### Demo
https://kartofelek007.github.io/progress-bar/

### Info
To be able to calculate the size of the downloaded files, the script sends a query beforehand to download only their headers. For this reason, it is suitable for showing downloads of large files, but rather not many small ones.

### Change of file data download
By default to download Instead of downloading the size of each file individually, you can also pass this data in another form - for example, some kind of array. To do this overwrite the function `generateSources`:

```
(async () => {
    const sources = [...]

    const dataJSON = [
        {url : "....", size: "...."}
    ]

    const loader = new LoadImages(sources);

    //rewrite function. You should set sourceVerified to syntax like below
    loader.generateSources = () => {
        for (let el of dataJSON) {
            this.sourceVerified.push({
                url: el.url,
                size: el.size
            })
        }
    }

    //config part
    //before start entire loading
    loader.beforeLoading = ({bytesAll, allFilesStatus}) => {
        ...
    }
    //after load single image
    loader.onLoadImage = ({img, url, bytesLoaded, bytesLoadedAll, bytesAll, progressAll, allFilesStatus}) => {
        ...
    }
    //on progress single image
    loader.onProgressImage = ({url, progressImg, bytesLoadedImg, bytesLoadedAll, bytesAll, progressAll, allFilesStatus}) => {
        ...
    }
    //after entire loading
    loader.afterLoading = ({bytesAll, allFilesStatus}) => {
        ...
    }

    //start loading
    await loader.prepareLoading()
    await loader.startLoading();
})()
```