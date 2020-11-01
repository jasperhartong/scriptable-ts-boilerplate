async function getSecret() {
    let secret = args.widgetParameter;
    if (!secret && config.runsInApp) {
        const alert = new Alert();
        alert.title = "Please fill in your secret";
        alert.message = "The secret can also be filled in the parameter field of the widget settings (tap on widget in wiggle mode)";
        alert.addSecureTextField("secret");
        alert.addAction("Done");
        await alert.presentAlert();
        secret = alert.textFieldValue(0);
    }
    return secret || "INVALID_SECRET";
}
async function getData(url) {
    try {
        const req = new Request(url);
        const response = await req.loadJSON();
        return response;
    }
    catch (error) {
        handleError("2002");
        throw Error(error);
    }
}
async function getDataWithSecret(createUrl) {
    const secret = await getSecret();
    return getData(createUrl(secret));
}
function createTextWidget(pretitle, title, subtitle, color) {
    let w = new ListWidget();
    // w.url = "https://emittime.app"
    w.backgroundColor = new Color(color, 1);
    let preTxt = w.addText(pretitle);
    preTxt.textColor = Color.white();
    preTxt.textOpacity = 0.8;
    preTxt.font = Font.systemFont(10);
    w.addSpacer(5);
    let titleTxt = w.addText(title);
    titleTxt.textColor = Color.white();
    titleTxt.font = Font.systemFont(16);
    w.addSpacer(5);
    let subTxt = w.addText(subtitle);
    subTxt.textColor = Color.white();
    subTxt.textOpacity = 0.8;
    subTxt.font = Font.systemFont(12);
    // @ts-ignore
    w.addSpacer(null);
    let a = w.addText("");
    a.textColor = Color.white();
    a.textOpacity = 0.8;
    a.font = Font.systemFont(12);
    return w;
}
function createErrorWidget(code) {
    return createTextWidget("EMIT/TIME", "No data", "Did you set the right secret in the parameter field?", "#000");
}
async function presentErrorAlert(code) {
    const alert = new Alert();
    alert.title = "Emit/Time Error";
    alert.message = "Did you enter the right secret?";
    alert.addAction("OK");
    return await alert.presentAlert();
}
async function handleError(code = "") {
    if (config.runsInWidget) {
        Script.setWidget(createErrorWidget());
    }
    if (config.runsInApp) {
        await presentErrorAlert();
    }
}

// Variables used by Scriptable.
const widgetModule = {
    createWidget: async (params) => {
        const response = await getDataWithSecret(secret => `https://emittime.app/api/ios-widgets/${secret}/own`);
        if (!response.ok) {
            return createErrorWidget();
        }
        const { pretitle, title, subtitle, color } = response.data;
        return createTextWidget(pretitle, title, subtitle, color);
    }
};

module.exports = widgetModule;
