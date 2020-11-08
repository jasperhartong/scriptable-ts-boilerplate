(function () {

    const addFlexSpacer = ({ stack }) => {
        // @ts-ignore
        stack.addSpacer(null);
    };

    const addSymbol = ({ stack, symbol = 'applelogo', color = Color.white(), size = 20, }) => {
        const _sym = SFSymbol.named(symbol);
        const wImg = stack.addImage(_sym.image);
        wImg.tintColor = color;
        wImg.imageSize = new Size(size, size);
    };

    const addTextWithSymbolStack = ({ stack, text, symbol, color = Color.white(), fontSize = 20, }) => {
        const _stack = stack.addStack();
        _stack.centerAlignContent();
        addSymbol({
            stack: _stack,
            symbol,
            size: fontSize,
            color: new Color(color.hex, 0.8)
        });
        _stack.addSpacer(3);
        let _text = _stack.addText(text);
        _text.textColor = color;
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
            addFlexSpacer({ stack: mainStack });
            return widget;
        }
    };
    const addStatsStack = ({ stack }) => {
        const statsStack = stack.addStack();
        statsStack.centerAlignContent();
        addTextWithSymbolStack({
            stack: statsStack,
            symbol: "person.crop.circle",
            text: "€0,50",
            fontSize: 10,
            color: Color.white()
        });
        addFlexSpacer({ stack: statsStack });
        addTextWithSymbolStack({
            stack: statsStack,
            symbol: "network",
            text: "€11.042,50",
            fontSize: 10,
            color: Color.white()
        });
        statsStack.backgroundColor = new Color(Color.darkGray().hex, 0.8);
        statsStack.setPadding(4, 4, 4, 4);
        statsStack.cornerRadius = 8;
        return statsStack;
    };
    module.exports = widgetModule;

}());
