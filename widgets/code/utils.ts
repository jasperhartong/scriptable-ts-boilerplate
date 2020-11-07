export interface WidgetModuleParams {
    widgetParameter: string;
    debug: boolean
}
export interface WidgetModule {
    createWidget: (params: WidgetModuleParams) => Promise<ListWidget>;
}

interface DownloadWidgetModuleArgs {
    fileName: string;
    rootUrl: string;
    widgetParameter: string;
    downloadQueryString: string;
}

export const argsConfig: DownloadWidgetModuleArgs = {
    fileName: "__fileName__",
    rootUrl: "__rootUrl__",
    widgetParameter: "__widgetParameter__",
    downloadQueryString: "__downloadQueryString__",
}


function createTextWidget(pretitle: string, title: string, subtitle: string, color: string) {
    let w = new ListWidget()
    w.backgroundColor = new Color(color, 1)
    let preTxt = w.addText(pretitle)
    preTxt.textColor = Color.white()
    preTxt.textOpacity = 0.8
    preTxt.font = Font.systemFont(10)
    w.addSpacer(5)
    let titleTxt = w.addText(title)
    titleTxt.textColor = Color.white()
    titleTxt.font = Font.systemFont(16)
    w.addSpacer(5)
    let subTxt = w.addText(subtitle)
    subTxt.textColor = Color.white()
    subTxt.textOpacity = 0.8
    subTxt.font = Font.systemFont(12)

    // @ts-ignore
    w.addSpacer(null)
    let a = w.addText("")
    a.textColor = Color.white()
    a.textOpacity = 0.8
    a.font = Font.systemFont(12)
    return w
}

export const logToWidget = (widget: ListWidget, message: string) => {
    console.log(message)
    let a = widget.addText(message)
    a.textColor = Color.red()
    a.textOpacity = 0.8
    a.font = Font.systemFont(10)
}

function createErrorWidget(subtitle: string) {
    return createTextWidget("ERROR", "Widget Error", subtitle, "#000")

}

async function presentErrorAlert(code: string) {
    const alert = new Alert();
    alert.title = "Error";
    alert.message = "Something wnet wrong"
    alert.addAction("OK");
    return await alert.presentAlert();
}

async function handleError(code: string = "") {
    if (config.runsInWidget) {
        Script.setWidget(createErrorWidget(code))
    }
    if (config.runsInApp) {
        await presentErrorAlert(code)
    }
}

const enforceDir = (fm: FileManager, path: string) => {
    if (fm.fileExists(path) && !fm.isDirectory(path)) {
        fm.remove(path)
    }
    if (!fm.fileExists(path)) {
        fm.createDirectory(path)
    }
}

async function downloadWidgetModule({ fileName, rootUrl, downloadQueryString }: DownloadWidgetModuleArgs, forceDownload = false) {
    const fm = FileManager.local()
    // const scriptPath = module.filename

    const widgetLoaderDir = fm.joinPath(fm.libraryDirectory(), "widget-loader")
    enforceDir(fm, widgetLoaderDir);

    const widgetModuleDir = fm.joinPath(widgetLoaderDir, fileName)
    enforceDir(fm, widgetModuleDir);

    const widgetModuleFilename = fileName + '.js'
    const widgetModuleEtag = fileName + '.etag'
    const widgetModulePath = fm.joinPath(widgetModuleDir, widgetModuleFilename)
    const widgetModuleEtagPath = fm.joinPath(widgetModuleDir, widgetModuleEtag)
    const widgetModuleDownloadUrl = rootUrl + widgetModuleFilename + (downloadQueryString.startsWith("?") ? downloadQueryString : "")

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


export { createTextWidget, createErrorWidget, handleError, downloadWidgetModule }


