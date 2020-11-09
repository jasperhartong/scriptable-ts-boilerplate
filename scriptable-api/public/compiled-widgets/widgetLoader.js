
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: __iconColor__; icon-glyph: __iconGlyph__;

const RequestWithTimeout = (url, timeoutSeconds = 5) => {
    const request = new Request(url);
    // @ts-ignore
    request.timeoutInterval = timeoutSeconds;
    return request;
};

const ROOT_MODULE_PATH = "widget-loader";
const widgetModuleDownloadConfig = {
    moduleName: "__moduleName__",
    rootUrl: "__rootUrl__",
    defaultWidgetParameter: "__defaultWidgetParameter__",
    downloadQueryString: "__downloadQueryString__",
};
async function getOrCreateWidgetModule({ moduleName, rootUrl, downloadQueryString }, forceDownload = false) {
    const fm = FileManager.local();
    const rootModuleDir = fm.joinPath(fm.libraryDirectory(), ROOT_MODULE_PATH);
    enforceDir(fm, rootModuleDir);
    const widgetModuleDir = fm.joinPath(rootModuleDir, moduleName);
    enforceDir(fm, widgetModuleDir);
    const widgetModuleFilename = `${moduleName}.js`;
    const widgetModuleEtag = `${moduleName}.etag`;
    const widgetModulePath = fm.joinPath(widgetModuleDir, widgetModuleFilename);
    const widgetModuleEtagPath = fm.joinPath(widgetModuleDir, widgetModuleEtag);
    const widgetModuleDownloadUrl = rootUrl + widgetModuleFilename + (downloadQueryString.startsWith("?") ? downloadQueryString : "");
    try {
        // Check if an etag was saved for this file
        if (fm.fileExists(widgetModuleEtagPath) && !forceDownload) {
            const lastEtag = fm.readString(widgetModuleEtagPath);
            const headerReq = RequestWithTimeout(widgetModuleDownloadUrl);
            headerReq.method = "HEAD";
            await headerReq.load();
            const etag = getResponseHeader(headerReq, "Etag");
            if (lastEtag === etag) {
                console.log(`ETag is same, return cached file for ${widgetModuleDownloadUrl}`);
                return widgetModulePath;
            }
        }
        console.log("Downloading library file '" + widgetModuleDownloadUrl + "' to '" + widgetModulePath + "'");
        const req = RequestWithTimeout(widgetModuleDownloadUrl);
        const libraryFile = await req.load();
        const etag = getResponseHeader(req, "Etag");
        if (etag) {
            fm.writeString(widgetModuleEtagPath, etag);
        }
        fm.write(widgetModulePath, libraryFile);
    }
    catch (error) {
        console.error("Downloading module failed, return existing module");
        console.error(error);
    }
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
const enforceDir = (fm, path) => {
    if (fm.fileExists(path) && !fm.isDirectory(path)) {
        fm.remove(path);
    }
    if (!fm.fileExists(path)) {
        fm.createDirectory(path);
    }
};

const DEBUG = false;
const FORCE_DOWNLOAD = false;
const widgetModulePath = await getOrCreateWidgetModule(widgetModuleDownloadConfig, FORCE_DOWNLOAD);
const widgetModule = importModule(widgetModulePath);
const widget = await widgetModule.createWidget({
    widgetParameter: args.widgetParameter || widgetModuleDownloadConfig.defaultWidgetParameter,
    debug: DEBUG
});
// preview the widget if in app
if (!config.runsInWidget) {
    await widget.presentSmall();
}
Script.setWidget(widget);
Script.complete();
