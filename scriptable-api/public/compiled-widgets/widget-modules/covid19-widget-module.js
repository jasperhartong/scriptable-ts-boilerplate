// async function getSecret(): Promise<string | undefined> {
//     let secret = args.widgetParameter;
//     if (!secret && config.runsInApp) {
//         const alert = new Alert();
//         alert.title = "Please fill in your secret";
//         alert.message = "The secret can also be filled in the parameter field of the widget settings (tap on widget in wiggle mode)";
//         alert.addSecureTextField("secret")
//         alert.addAction("Done")
//         await alert.presentAlert()
//         secret = alert.textFieldValue(0)
//     }
//     return secret || "INVALID_SECRET";
// }
// async function getData<T>(url: string): Promise<Response<T>> {
//     try {
//         const req = new Request(url)
//         const response: Response<T> = await req.loadJSON()
//         return response
//     } catch (error) {
//         handleError("2002")
//         throw Error(error)
//     }
// }
// async function getDataWithSecret<T>(createUrl: (secret?: string) => string): Promise<Response<T>> {
//     const secret = await getSecret();
//     return getData<T>(createUrl(secret));
// }
function createTextWidget(pretitle, title, subtitle, color) {
    let w = new ListWidget();
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
function createErrorWidget(subtitle) {
    return createTextWidget("ERROR", "Widget Error", subtitle, "#000");
}

// Based on https://gist.github.com/planecore/e7b4c1e5db2dd28b1a023860e831355e
const createWidget = async (country) => {
    if (!country) {
        createErrorWidget("No country");
    }
    const url = `https://coronavirus-19-api.herokuapp.com/countries/${country}`;
    const req = new Request(url);
    const res = await req.loadJSON();
    return createTextWidget("Coronavirus", `${res.todayCases} Today`, `${res.cases} Total`, "#53d769");
};
const widgetModule = {
    createWidget: async (params) => {
        return createWidget(params.widgetParameter);
    }
};

module.exports = widgetModule;
