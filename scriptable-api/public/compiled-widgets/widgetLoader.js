
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: __iconColor__; icon-glyph: __iconGlyph__;

(function () {

    const argsConfig = {
        fileName: "__fileName__",
        rootUrl: "__rootUrl__",
        widgetParameter: "__widgetParameter__",
        downloadQueryString: "__downloadQueryString__",
    };
    const enforceDir = (fm, path) => {
        if (fm.fileExists(path) && !fm.isDirectory(path)) {
            fm.remove(path);
        }
        if (!fm.fileExists(path)) {
            fm.createDirectory(path);
        }
    };
    async function downloadWidgetModule({ fileName, rootUrl, downloadQueryString }, forceDownload = false) {
        const fm = FileManager.local();
        // const scriptPath = module.filename
        const widgetLoaderDir = fm.joinPath(fm.libraryDirectory(), "widget-loader");
        enforceDir(fm, widgetLoaderDir);
        const widgetModuleDir = fm.joinPath(widgetLoaderDir, fileName);
        enforceDir(fm, widgetModuleDir);
        const widgetModuleFilename = fileName + '.js';
        const widgetModuleEtag = fileName + '.etag';
        const widgetModulePath = fm.joinPath(widgetModuleDir, widgetModuleFilename);
        const widgetModuleEtagPath = fm.joinPath(widgetModuleDir, widgetModuleEtag);
        const widgetModuleDownloadUrl = rootUrl + widgetModuleFilename + (downloadQueryString.startsWith("?") ? downloadQueryString : "");
        // Check if an etag was saved for this file
        if (fm.fileExists(widgetModuleEtagPath) && !forceDownload) {
            const lastEtag = fm.readString(widgetModuleEtagPath);
            const headerReq = new Request(widgetModuleDownloadUrl);
            headerReq.method = "HEAD";
            await headerReq.load();
            const etag = getResponseHeader(headerReq, "Etag");
            if (lastEtag === etag) {
                console.log(`ETag is same, return cached file for ${widgetModuleDownloadUrl}`);
                return widgetModulePath;
            }
        }
        console.log("Downloading library file '" + widgetModuleDownloadUrl + "' to '" + widgetModulePath + "'");
        const req = new Request(widgetModuleDownloadUrl);
        const libraryFile = await req.load();
        const etag = getResponseHeader(req, "Etag");
        if (etag) {
            fm.writeString(widgetModuleEtagPath, etag);
        }
        fm.write(widgetModulePath, libraryFile);
        return widgetModulePath;
    }
    const getResponseHeader = (request, header) => {
        if (!request.response) {
            return undefined;
        }
        const key = Object.keys(request.response["headers"])
            .find(key => key.toLowerCase() === header.toLowerCase());
        return key ? request.response["headers"][key] : undefined;
    };

    const DEBUG = false;
    downloadWidgetModule(argsConfig)
        .then(async (widgetModulePath) => {
        // import downloaded widgetModule
        const widgetModule = importModule(widgetModulePath);
        // create the widget
        const params = {
            widgetParameter: args.widgetParameter || argsConfig.widgetParameter,
            debug: DEBUG
        };
        const widget = await widgetModule.createWidget(params);
        // preview the widget
        if (!config.runsInWidget) {
            await widget.presentSmall();
        }
        Script.setWidget(widget);
        Script.complete();
    }).catch(error => {
        console.error(error);
    });

}());
