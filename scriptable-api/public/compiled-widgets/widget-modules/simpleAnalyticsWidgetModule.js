(function () {

    const DynamicColor = ({ lightColor, darkColor }) => Color.dynamic(lightColor, darkColor);
    const DefaultColor = () => DynamicColor({ lightColor: Color.white(), darkColor: Color.black() });

    // From https://talk.automators.fm/t/get-available-widget-height-and-width-depending-on-the-devices-screensize/9258/4
    const getWidgetSizeInPoint = (widgetSize = (config.widgetFamily ? config.widgetFamily : null)) => {
        // stringify device screen size
        const devSize = `${Device.screenSize().width}x${Device.screenSize().height}`;
        // screen size to widget size mapping for iPhone, excluding the latest iPhone 12 series. iPad size
        const sizeMap = {
            // iPad Mini 2/3/4, iPad 3/4, iPad Air 1/2. 9.7" iPad Pro
            // '768x1024': { small: [0, 0], medium: [0, 0], large: [0, 0] },
            // 10.2" iPad
            // '1080x810': { small: [0, 0], medium: [0, 0], large: [0, 0] },
            // 10.5" iPad Pro, 10.5" iPad Air 3rd Gen
            // '1112x834': { small: [0, 0], medium: [0, 0], large: [0, 0] },
            // 10.9" iPad Air 4th Gen
            // '1180x820': { small: [0, 0], medium: [0, 0], large: [0, 0] },
            // 11" iPad Pro
            '1194x834': { small: [155, 155], medium: [329, 155], large: [345, 329] },
            // 12.9" iPad Pro
            '1366x1024': { small: [170, 170], medium: [332, 170], large: [382, 332] },
            // 12 Pro Max
            // '428x926': { small: [0, 0], medium: [0, 0], large: [0, 0] },
            // XR, 11, 11 Pro Max
            '414x896': { small: [169, 169], medium: [360, 169], large: [360, 376] },
            // 12, 12 Pro
            // '390x844': : { small: [0, 0], medium: [0, 0], large: [0, 0] },
            // X, XS, 11 Pro, 12 Mini
            '375x812': { small: [155, 155], medium: [329, 155], large: [329, 345] },
            // 6/7/8(S) Plus
            '414x736': { small: [159, 159], medium: [348, 159], large: [348, 357] },
            // 6/7/8(S) and 2nd Gen SE
            '375x667': { small: [148, 148], medium: [322, 148], large: [322, 324] },
            // 1st Gen SE
            '320x568': { small: [141, 141], medium: [291, 141], large: [291, 299] }
        };
        let widgetSizeInPoint = null;
        if (widgetSize) {
            let mappedSize = sizeMap[devSize];
            if (mappedSize) {
                widgetSizeInPoint = new Size(...mappedSize[widgetSize]);
            }
        }
        return widgetSizeInPoint;
    };

    const ErrorImage = ({ error, width, height }) => {
        const text = `${(error === null || error === void 0 ? void 0 : error.message) || error}`;
        const dc = new DrawContext();
        dc.size = new Size(width || 200, height || 200);
        dc.respectScreenScale = true;
        dc.opaque = false;
        dc.setTextColor(Color.red());
        dc.setFont(Font.semiboldSystemFont(dc.size.width / 10));
        dc.drawText(text, new Point(dc.size.width / 10, 8));
        return dc.getImage();
    };

    const SparkBarImage = ({ series, width, height, color = DefaultColor(), lastBarColor = Color.orange() }) => {
        if (series.length === 0) {
            return ErrorImage({ error: "No Data", width, height });
        }
        const widgetSize = getWidgetSizeInPoint();
        const dc = new DrawContext();
        dc.size = new Size(width || (widgetSize === null || widgetSize === void 0 ? void 0 : widgetSize.width) || 200, height || (widgetSize === null || widgetSize === void 0 ? void 0 : widgetSize.height) || 200);
        dc.respectScreenScale = true;
        dc.opaque = false;
        const barColor = color;
        const barWidth = (dc.size.width) / series.length - 4;
        const maxValue = Math.max(...series);
        // Calculate the rendered height of the bars, make sure they're at least 1 pixel
        const pixelMultiplier = dc.size.height / maxValue;
        const pixelValues = series.map(v => Math.max(v * pixelMultiplier, 1));
        // Draw the bars
        pixelValues.forEach((v, i) => {
            dc.setFillColor(i === pixelValues.length - 1 ? lastBarColor : barColor);
            const x = (dc.size.width * i / pixelValues.length);
            const barHeight = v;
            const y = dc.size.height - barHeight;
            dc.fillRect(new Rect(x, y, barWidth, barHeight));
        });
        const image = dc.getImage();
        return image;
    };

    const addFlexSpacer = ({ to }) => {
        // @ts-ignore
        to.addSpacer();
    };

    const SimpleSparkBarWidget = ({ series, header, title, description, backgroundColor, barColor, lastBarColor }) => {
        const widget = new ListWidget();
        widget.backgroundColor = backgroundColor;
        // Header
        const headerTxt = widget.addText(header.text);
        headerTxt.textColor = header.color;
        headerTxt.font = Font.systemFont(10);
        // Vertical Space
        addFlexSpacer({ to: widget });
        // BarChart (centered)
        const barStack = widget.addStack();
        barStack.layoutHorizontally();
        addFlexSpacer({ to: barStack });
        if (series.length > 0) {
            barStack.addImage(SparkBarImage({
                series,
                color: barColor,
                lastBarColor,
                height: 100,
                width: 400
            }));
        }
        addFlexSpacer({ to: barStack });
        // Vertical Space
        widget.addSpacer(10);
        // Title
        const titleTxt = widget.addText(title.text);
        titleTxt.textColor = title.color;
        titleTxt.font = Font.boldSystemFont(16);
        // Vertical space
        widget.addSpacer(2);
        // Description
        const descriptionText = widget.addText(description.text);
        descriptionText.textColor = description.color;
        descriptionText.font = Font.systemFont(12);
        return widget;
    };

    const RequestWithTimeout = (url, timeoutSeconds = 5) => {
        const request = new Request(url);
        request.timeoutInterval = timeoutSeconds;
        return request;
    };

    const widgetModule = {
        createWidget: async (params) => {
            var _a;
            const { website, apiKey } = parseWidgetParameter(params.widgetParameter);
            // Styling
            const highlightColor = new Color("#b93545", 1.0);
            const textColor = new Color("#a4bdc0", 1.0);
            const backgroundColor = new Color("#20292a", 1);
            const barColor = new Color("#198c9f", 1);
            // Fallback data
            let series = [];
            let titleText = "No data";
            let descriptionText = "Check the parameter settings";
            // Load data
            const data = await requestSimpleAnalyticsData({ website, apiKey });
            if (data) {
                const pageViewsToday = ((_a = data.visits[data.visits.length - 1]) === null || _a === void 0 ? void 0 : _a.pageviews) || 0;
                series = data.visits.map(visit => visit.pageviews);
                titleText = `${pageViewsToday} views`;
                descriptionText = `${data.pageviews} this month`;
            }
            const widget = SimpleSparkBarWidget({
                series,
                header: { text: website, color: textColor },
                title: { text: titleText, color: highlightColor },
                description: { text: descriptionText, color: textColor },
                backgroundColor,
                barColor,
                lastBarColor: highlightColor,
            });
            if (website) {
                // Open Simple Analytics stats when tapped
                widget.url = `https://simpleanalytics.com/${website}`;
            }
            return widget;
        }
    };
    module.exports = widgetModule;
    // SimpleAnalytics helpers
    const parseWidgetParameter = (param) => {
        // handles: <apiKey>@<website> || @<website> || <website>
        const paramParts = param.toLowerCase().replace(/ /g, "").split("@");
        let apiKey = "";
        let website = "";
        switch (paramParts.length) {
            case 1:
                [website] = paramParts;
                break;
            case 2:
                [apiKey, website] = paramParts;
                break;
        }
        return { apiKey, website };
    };
    const formatDateQueryParam = (date) => date.toISOString().split('T')[0];
    const requestSimpleAnalyticsData = async ({ website, apiKey, daysAgo = 31 }) => {
        const today = new Date();
        const startDate = new Date(new Date().setDate(today.getDate() - daysAgo));
        const url = `https://simpleanalytics.com/${website}.json?version=2&start=${formatDateQueryParam(startDate)}&end=${formatDateQueryParam(today)}`;
        const req = RequestWithTimeout(url);
        if (apiKey) {
            req.headers = { "Api-Key": apiKey };
        }
        const data = await req.loadJSON();
        return req.response.statusCode === 200 ? data : null;
    };

})();
