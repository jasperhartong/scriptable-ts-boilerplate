export interface WidgetModuleParams {
    widgetParameter: string;
    debug: boolean
}
export interface WidgetModule {
    createWidget: (params: WidgetModuleParams) => Promise<ListWidget>;
}
export interface ErrorData {
    ok: false;
}

export interface SuccessData<T> {
    ok: true;
    data: T
}

export const argsConfig = {
    fileName: "__fileName__",
    rootUrl: "__rootUrl__",
    widgetParameter: "__widgetParameter__"
}

export type Response<T> = SuccessData<T> | ErrorData

async function getSecret(): Promise<string | undefined> {
    let secret = args.widgetParameter;

    if (!secret && config.runsInApp) {
        const alert = new Alert();
        alert.title = "Please fill in your secret";
        alert.message = "The secret can also be filled in the parameter field of the widget settings (tap on widget in wiggle mode)";
        alert.addSecureTextField("secret")
        alert.addAction("Done")
        await alert.presentAlert()
        secret = alert.textFieldValue(0)
    }
    return secret || "INVALID_SECRET";
}

async function getData<T>(url: string): Promise<Response<T>> {
    try {
        const req = new Request(url)
        const response: Response<T> = await req.loadJSON()
        return response
    } catch (error) {
        handleError("2002")
        throw Error(error)
    }
}

async function getDataWithSecret<T>(createUrl: (secret?: string) => string): Promise<Response<T>> {
    const secret = await getSecret();
    return getData<T>(createUrl(secret));
}




function createTextWidget(pretitle: string, title: string, subtitle: string, color: string) {
    let w = new ListWidget()
    // w.url = "https://emittime.app"
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


function createErrorWidget(code: string) {
    return createTextWidget("EMIT/TIME", "No data", "Did you set the right secret in the parameter field?", "#000")

}

async function presentErrorAlert(code: string) {
    const alert = new Alert();
    alert.title = "Emit/Time Error";
    alert.message = "Did you enter the right secret?"
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


export { getDataWithSecret, createTextWidget, createErrorWidget, handleError, downloadWidgetModule };


