// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: user-md;

interface WidgetFields {
    pretitle: string;
    title: string;
    subtitle: string;
    color: string;
}

type ResponseData = { ok: false } | { ok: true, data: WidgetFields }

const secret = getSecret();

const url = `http://macbook-pro.local:3000/api/ios-widgets/${secret}/own`
const req = new Request(url)
// @ts-ignore
let response: ResponseData = await req.loadJSON()
if (!response.ok) {
    throw Error(`No data: ${JSON.stringify(response)}. Secret: ${secret}`)
}

const { pretitle, title, subtitle, color } = response.data;

if (config.runsInWidget) {
    // create and show widget
    let widget = createWidget(pretitle, title, subtitle, color)
    Script.setWidget(widget)
    Script.complete()
} else {
    // make table
    let table = new UITable()


    // add header
    let row = new UITableRow()
    row.isHeader = true
    row.addText(`Emit/Time`)
    table.addRow(row)

    // fill data
    table.addRow(createRow(title, 0))

    if (config.runsWithSiri)
        Speech.speak(`${title}`)

    // present table
    table.present()
}

function createRow(title: string, number: number) {
    let row = new UITableRow()
    row.addText(title)
    row.addText(number.toString()).rightAligned()
    return row
}


function createWidget(pretitle: string, title: string, subtitle: string, color: string) {
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

function getSecret() {
    let secret = args.widgetParameter;

    if (!secret) {
        const alert = new Alert();
        alert.title = "Fill in secret";
        alert.message = "The secret can also be filled in the parameter field of the widget settings (tap on widget in wiggle mode)";
        alert.addSecureTextField("secret")
        alert.addAction("Done")
        // @ts-ignore
        await alert.presentAlert()
        secret = alert.textFieldValue(0)
    }
    return secret;
}