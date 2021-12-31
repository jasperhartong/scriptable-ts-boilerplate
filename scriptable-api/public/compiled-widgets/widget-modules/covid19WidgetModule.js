(function () {

    const addFlexSpacer = ({ to }) => {
        // @ts-ignore
        to.addSpacer();
    };

    const SimpleTextWidget = (pretitle, title, subtitle, color) => {
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
        addFlexSpacer({ to: w });
        let a = w.addText("");
        a.textColor = Color.white();
        a.textOpacity = 0.8;
        a.font = Font.systemFont(12);
        return w;
    };

    const ErrorWidget = (subtitle) => {
        return SimpleTextWidget("ERROR", "Widget Error", subtitle, "#000");
    };

    const RequestWithTimeout = (url, timeoutSeconds = 5) => {
        const request = new Request(url);
        request.timeoutInterval = timeoutSeconds;
        return request;
    };

    // Based on https://gist.github.com/planecore/e7b4c1e5db2dd28b1a023860e831355e
    const createWidget = async (country) => {
        if (!country) {
            return ErrorWidget("No country");
        }
        const url = `https://coronavirus-19-api.herokuapp.com/countries/${country}`;
        const req = RequestWithTimeout(url);
        const res = await req.loadJSON();
        return SimpleTextWidget("Coronavirus", `${res.todayCases} Today`, `${res.cases} Total`, "#53d769");
    };
    const widgetModule = {
        createWidget: async (params) => {
            return createWidget(params.widgetParameter);
        }
    };
    module.exports = widgetModule;

})();
