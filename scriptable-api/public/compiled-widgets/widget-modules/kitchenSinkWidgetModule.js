(function () {

    const addFlexSpacer = ({ to }) => {
        // @ts-ignore
        to.addSpacer(null);
    };

    const DynamicColor = ({ lightColor, darkColor }) => 
    // @ts-ignore
    Color.dynamic(lightColor, darkColor);

    const addSymbol = ({ to, symbol = 'applelogo', color = DynamicColor({ lightColor: Color.white(), darkColor: Color.black() }), size = 20, }) => {
        const _sym = SFSymbol.named(symbol);
        const wImg = to.addImage(_sym.image);
        wImg.tintColor = color;
        wImg.imageSize = new Size(size, size);
    };

    const addTextWithSymbolStack = ({ to, text, symbol, textColor = DynamicColor({ lightColor: Color.white(), darkColor: Color.black() }), symbolColor = DynamicColor({ lightColor: Color.white(), darkColor: Color.black() }), fontSize = 20, }) => {
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
            addFlexSpacer({ to: mainStack });
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
