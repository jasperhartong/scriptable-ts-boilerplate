export interface WidgetModuleParams {
    widgetParameter: string;
    debug: boolean
}
export interface WidgetModule {
    createWidget: (params: WidgetModuleParams) => Promise<ListWidget>;
}

export const argsConfig = {
    fileName: "__fileName__",
    rootUrl: "__rootUrl__",
    widgetParameter: "__widgetParameter__"
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


async function downloadWidgetModule({ fileName, rootUrl, forceDownload = false }: { fileName: string, rootUrl: string, forceDownload?: boolean }) {
    const fm = FileManager.local()

    const scriptPath = module.filename
    const libraryDir = scriptPath.replace(fm.fileName(scriptPath, true), fm.fileName(scriptPath, false))

    if (fm.fileExists(libraryDir) && !fm.isDirectory(libraryDir)) {
        fm.remove(libraryDir)
    }
    if (!fm.fileExists(libraryDir)) {
        fm.createDirectory(libraryDir)
    }
    const libraryFilename = fileName + '.js'
    const libraryEtag = fileName + '.etag'
    const libraryPath = fm.joinPath(libraryDir, libraryFilename)
    const libraryEtagPath = fm.joinPath(libraryDir, libraryEtag)
    const libraryUrl = rootUrl + fileName + '.js'

    // Check if an etag was saved for this file
    if (fm.fileExists(libraryEtagPath)) {
        const lastEtag = fm.readString(libraryEtagPath)
        const headerReq = new Request(libraryUrl);
        headerReq.method = "HEAD";
        await headerReq.load()
        const etag = getResponseHeader(headerReq, "Etag");
        if (lastEtag === etag) {
            console.log(`ETag is same, return cached file for for ${libraryUrl}`)
            return fm.fileName(scriptPath, false) + '/' + libraryFilename
        }
    }

    console.log("Downloading library file '" + libraryUrl + "' to '" + libraryPath + "'")
    const req = new Request(libraryUrl)
    const libraryFile = await req.load()
    const etag = getResponseHeader(req, "Etag");
    if (etag) {
        fm.writeString(libraryEtagPath, etag)
    }
    fm.write(libraryPath, libraryFile)

    return fm.fileName(scriptPath, false) + '/' + libraryFilename
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


