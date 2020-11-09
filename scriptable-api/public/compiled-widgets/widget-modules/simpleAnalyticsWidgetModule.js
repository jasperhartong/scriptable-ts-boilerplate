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

    const SparkBarImage = ({ series, width, height, color = DefaultColor(), lastBarColor = Color.orange() }) => {
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

    const RequestWithTimeout = (url, timeoutSeconds = 5) => {
        const request = new Request(url);
        request.timeoutInterval = timeoutSeconds;
        return request;
    };

    const widgetModule = {
        createWidget: async (params) => {
            const widget = new ListWidget();
            const website = params.widgetParameter || `scriptable-ts-boilerplate.vercel.app`;
            const data = await requestSimpleAnalyticsData(website);
            // TODO: render something if no website is found
            widget.backgroundColor = Color.lightGray();
            widget.addImage(SparkBarImage({
                series: data.visits.map(visit => visit.pageviews)
            }));
            // create the widget
            return widget;
        }
    };
    module.exports = widgetModule;
    // helpers
    const formatDateQueryParam = (date) => date.toISOString().split('T')[0];
    const requestSimpleAnalyticsData = async (website) => {
        const today = new Date();
        const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 6));
        const url = `https://simpleanalytics.com/${website}.json?version=2&start=${formatDateQueryParam(sevenDaysAgo)}&end=${formatDateQueryParam(today)}`;
        const req = RequestWithTimeout(url);
        // TODO: check if error result
        const data = (await req.loadJSON());
        return data;
    };

}());
