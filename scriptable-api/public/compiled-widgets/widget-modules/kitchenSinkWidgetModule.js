(function () {

    const DynamicColor = ({ lightColor, darkColor }) => 
    // @ts-ignore
    Color.dynamic(lightColor, darkColor);
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

    const SimpleBarChartImage = ({ series, width, height, color = DefaultColor() }) => {
        const widgetSize = getWidgetSizeInPoint();
        const dc = new DrawContext();
        dc.size = new Size(width || (widgetSize === null || widgetSize === void 0 ? void 0 : widgetSize.width) || 200, height || (widgetSize === null || widgetSize === void 0 ? void 0 : widgetSize.height) || 200);
        dc.respectScreenScale = true;
        dc.opaque = false;
        const barColor = color;
        const barWidth = (dc.size.width) / series.length - 4;
        const maxValue = Math.max(...series);
        const pixelMultiplier = dc.size.height / maxValue;
        const pixelValues = series.map(v => v * pixelMultiplier);
        // Draw the bars
        pixelValues.forEach((v, i) => {
            dc.setFillColor(barColor);
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
        to.addSpacer(null);
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

    const UnsplashImage = async ({ id = "random", width = 600, height = 600 }) => {
        const req = new Request(`https://source.unsplash.com/${id}/${width}x${height}`);
        try {
            return await req.loadImage();
        }
        catch (error) {
            return new Image();
        }
    };

    const widgetModule = {
        createWidget: async (params) => {
            const widget = new ListWidget();
            widget.backgroundImage = await UnsplashImage({ id: "Bkci_8qcdvQ", width: 800, height: 800 });
            const mainStack = widget.addStack();
            mainStack.layoutVertically();
            addStatsStack({ stack: mainStack });
            mainStack.addSpacer(4);
            addFlexSpacer({ to: mainStack });
            const barChartStack = mainStack.addStack();
            barChartStack.layoutHorizontally();
            barChartStack.topAlignContent();
            addFlexSpacer({ to: barChartStack });
            barChartStack.addImage(SimpleBarChartImage({
                series: [800000, 780000, 760000, 738000, 680000, 600000, 554600, 438000],
                width: 300,
                height: 200,
                color: new Color(Color.white().hex, 0.8)
            }));
            addFlexSpacer({ to: barChartStack });
            mainStack.addSpacer(4);
            let _text = mainStack.addText("50% decrease of cases since 2010");
            _text.centerAlignText();
            _text.textColor = new Color(Color.white().hex, 0.8);
            _text.font = Font.systemFont(12);
            return widget;
        }
    };
    const addStatsStack = ({ stack }) => {
        const statsStack = stack.addStack();
        statsStack.centerAlignContent();
        addTextWithSymbolStack({
            to: statsStack,
            symbol: "person.crop.circle",
            text: "€0,50",
            fontSize: 10,
            textColor: Color.white(),
            symbolColor: Color.white()
        });
        addFlexSpacer({ to: statsStack });
        addTextWithSymbolStack({
            to: statsStack,
            symbol: "network",
            text: "€11K",
            fontSize: 10,
            textColor: Color.white(),
            symbolColor: Color.white()
        });
        statsStack.backgroundColor = new Color(Color.darkGray().hex, 0.8);
        statsStack.setPadding(4, 4, 4, 4);
        statsStack.cornerRadius = 8;
        return statsStack;
    };
    module.exports = widgetModule;

}());
