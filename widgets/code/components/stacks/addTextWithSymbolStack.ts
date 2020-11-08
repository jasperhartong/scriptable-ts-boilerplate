import { addSymbol } from "./addSymbol"

interface Props {
    stack: WidgetStack;
    text: string;
    symbol: string;
    color?: Color;
    fontSize?: number
}

export const addTextWithSymbolStack = (
    {
        stack,
        text,
        symbol,
        color = Color.white(),
        fontSize = 20,
    }: Props
) => {
    const _stack = stack.addStack()
    _stack.centerAlignContent()

    addSymbol({
        stack: _stack,
        symbol,
        size: fontSize,
        color: new Color(color.hex, 0.8)
    })

    _stack.addSpacer(3)

    let _text = _stack.addText(text)
    _text.textColor = color;
    _text.font = Font.systemFont(fontSize)

    return _stack;
}
