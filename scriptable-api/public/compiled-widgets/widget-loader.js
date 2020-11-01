(function () {

    async function downloadWidgetModule({ name, rootUrl, forceDownload = false }) {
        const fm = FileManager.local();
        const scriptPath = module.filename;
        const libraryDir = scriptPath.replace(fm.fileName(scriptPath, true), fm.fileName(scriptPath, false));
        if (fm.fileExists(libraryDir) && !fm.isDirectory(libraryDir)) {
            fm.remove(libraryDir);
        }
        if (!fm.fileExists(libraryDir)) {
            fm.createDirectory(libraryDir);
        }
        const libraryFilename = name + '.js';
        const libraryEtag = name + '.etag';
        const libraryPath = fm.joinPath(libraryDir, libraryFilename);
        const libraryEtagPath = fm.joinPath(libraryDir, libraryEtag);
        const libraryUrl = rootUrl + name + '.js';
        // Check if an etag was saved for this file
        if (fm.fileExists(libraryEtagPath)) {
            const lastEtag = fm.readString(libraryEtagPath);
            const headerReq = new Request(libraryUrl);
            headerReq.method = "HEAD";
            await headerReq.load();
            const etag = getResponseHeader(headerReq, "Etag");
            if (lastEtag === etag) {
                console.log(`ETag is same, return cached file for for ${libraryUrl}`);
                return fm.fileName(scriptPath, false) + '/' + libraryFilename;
            }
        }
        console.log("Downloading library file '" + libraryUrl + "' to '" + libraryPath + "'");
        const req = new Request(libraryUrl);
        const libraryFile = await req.load();
        const etag = getResponseHeader(req, "Etag");
        if (etag) {
            fm.writeString(libraryEtagPath, etag);
        }
        fm.write(libraryPath, libraryFile);
        return fm.fileName(scriptPath, false) + '/' + libraryFilename;
    }
    const getResponseHeader = (request, header) => {
        if (!request.response) {
            return undefined;
        }
        const key = Object.keys(request.response["headers"])
            .find(key => key.toLowerCase() === header.toLowerCase());
        return key ? request.response["headers"][key] : undefined;
    };

    // Variables used by Scriptable.
    const DEBUG = false;
    downloadWidgetModule({
        name: "__name__",
        rootUrl: "__rootUrl__"
    })
        .then(async (widgetModulePath) => {
        // import downloaded widgetModule
        const widgetModule = importModule(widgetModulePath);
        // create the widget
        const params = {
            widgetParameter: args.widgetParameter,
            debug: DEBUG
        };
        const widget = await widgetModule.createWidget(params);
        // preview the widget
        if (!config.runsInWidget) {
            await widget.presentSmall();
        }
        Script.setWidget(widget);
        Script.complete();
    });

}());
