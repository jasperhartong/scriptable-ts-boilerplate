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

    const RequestWithTimeout = (url, timeoutSeconds = 5) => {
        const request = new Request(url);
        request.timeoutInterval = timeoutSeconds;
        return request;
    };

    const UnsplashImage = async ({ id = "random", width = 600, height = 600 }) => {
        const req = RequestWithTimeout(`https://source.unsplash.com/${id}/${width}x${height}`);
        try {
            return await req.loadImage();
        }
        catch (error) {
            return ErrorImage({ width, height, error });
        }
    };

    const addFlexSpacer = ({ to }) => {
        to.addSpacer();
    };

    const addSymbol = ({ to, symbol = 'applelogo', color = DefaultColor(), size = 20, }) => {
        const _sym = SFSymbol.named(symbol);
        const wImg = to.addImage(_sym.image);
        wImg.tintColor = color;
        wImg.imageSize = new Size(size, size);
    };

    const addTextWithSymbolStack = ({ to, text, symbol, textColor = DefaultColor(), symbolColor = DefaultColor(), fontSize = 20, }) => {
        const _stack = to.addStack();
        _stack.centerAlignContent();
        addSymbol({
            to: _stack,
            symbol,
            size: fontSize,
            color: symbolColor
        });
        _stack.addSpacer(3);
        let _text = _stack.addText(text);
        _text.textColor = textColor;
        _text.font = Font.systemFont(fontSize);
        return _stack;
    };

    const widgetModule = {
        createWidget: async (params) => {
            const widget = new ListWidget();
            widget.setPadding(8, 0, 0, 0);
            widget.backgroundImage = await UnsplashImage({ id: "KuF8-6EbBMs", width: 500, height: 500 });
            const mainStack = widget.addStack();
            mainStack.layoutVertically();
            addFlexSpacer({ to: mainStack });
            // Start Content
            const contentStack = mainStack.addStack();
            contentStack.layoutVertically();
            contentStack.setPadding(0, 16, 0, 16);
            contentStack.addImage(SparkBarImage({
                series: [800000, 780000, 760000, 738000, 680000, 650000, 600000, 554600, 500000, 438000],
                width: 400,
                height: 100,
                color: new Color(Color.white().hex, 0.6),
                lastBarColor: Color.orange()
            }));
            contentStack.addSpacer(8);
            let title = contentStack.addText("438.000 cases");
            title.textColor = Color.orange();
            title.font = Font.semiboldSystemFont(14);
            contentStack.addSpacer(2);
            let _text = contentStack.addText("A 50% decrease in the last 10 years");
            _text.textColor = Color.white();
            _text.font = Font.systemFont(12);
            // End Content
            addFlexSpacer({ to: mainStack });
            // Footer
            addStatsStack({ stack: mainStack });
            return widget;
        }
    };
    const addStatsStack = ({ stack }) => {
        const statsStack = stack.addStack();
        statsStack.centerAlignContent();
        statsStack.backgroundColor = new Color(Color.black().hex, 0.85);
        statsStack.setPadding(6, 16, 6, 16);
        addTextWithSymbolStack({
            to: statsStack,
            symbol: "person.crop.circle",
            text: "0,50",
            fontSize: 10,
            textColor: Color.lightGray(),
            symbolColor: Color.lightGray()
        });
        addFlexSpacer({ to: statsStack });
        addTextWithSymbolStack({
            to: statsStack,
            symbol: "network",
            text: "11K",
            fontSize: 10,
            textColor: Color.lightGray(),
            symbolColor: Color.lightGray()
        });
        return statsStack;
    };
    module.exports = widgetModule;

})();
