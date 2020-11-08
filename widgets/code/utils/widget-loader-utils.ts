import { IWidgetModuleDownloadConfig } from "code/utils/interfaces";

const ROOT_MODULE_PATH = "widget-loader";


export const widgetModuleDownloadConfig: IWidgetModuleDownloadConfig = {
    moduleName: "__moduleName__",
    rootUrl: "__rootUrl__",
    defaultWidgetParameter: "__defaultWidgetParameter__",
    downloadQueryString: "__downloadQueryString__",
}

async function getOrCreateWidgetModule(
    { moduleName, rootUrl, downloadQueryString }: IWidgetModuleDownloadConfig,
    forceDownload = false
) {
    const fm = FileManager.local()

    const rootModuleDir = fm.joinPath(fm.libraryDirectory(), ROOT_MODULE_PATH)
    enforceDir(fm, rootModuleDir);

    const widgetModuleDir = fm.joinPath(rootModuleDir, moduleName)
    enforceDir(fm, widgetModuleDir);

    const widgetModuleFilename = `${moduleName}.js`
    const widgetModuleEtag = `${moduleName}.etag`
    const widgetModulePath = fm.joinPath(widgetModuleDir, widgetModuleFilename)
    const widgetModuleEtagPath = fm.joinPath(widgetModuleDir, widgetModuleEtag)
    const widgetModuleDownloadUrl = rootUrl + widgetModuleFilename + (downloadQueryString.startsWith("?") ? downloadQueryString : "")

    try {
        // Check if an etag was saved for this file
        if (fm.fileExists(widgetModuleEtagPath) && !forceDownload) {
            const lastEtag = fm.readString(widgetModuleEtagPath)
            const headerReq = new Request(widgetModuleDownloadUrl);
            headerReq.method = "HEAD";
            await headerReq.load()
            const etag = getResponseHeader(headerReq, "Etag");
            if (lastEtag === etag) {
                console.log(`ETag is same, return cached file for ${widgetModuleDownloadUrl}`)
                return widgetModulePath;
            }
        }

        console.log("Downloading library file '" + widgetModuleDownloadUrl + "' to '" + widgetModulePath + "'")
        const req = new Request(widgetModuleDownloadUrl)
        const libraryFile = await req.load()
        const etag = getResponseHeader(req, "Etag");
        if (etag) {
            fm.writeString(widgetModuleEtagPath, etag)
        }
        fm.write(widgetModulePath, libraryFile)
    } catch (error) {
        console.error("Downloading module failed, return existing module")
        console.error(error)
    }

    return widgetModulePath
}

const getResponseHeader = (request: Request, header: string) => {
    if (!request.response) {
        return undefined;
    }
    const key = Object.keys(request.response["headers"])
        .find(key => key.toLowerCase() === header.toLowerCase());
    return key ? request.response["headers"][key] : undefined
}

const enforceDir = (fm: FileManager, path: string) => {
    if (fm.fileExists(path) && !fm.isDirectory(path)) {
        fm.remove(path)
    }
    if (!fm.fileExists(path)) {
        fm.createDirectory(path)
    }
}

export { getOrCreateWidgetModule };


