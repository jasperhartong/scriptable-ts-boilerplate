import { DefaultColor } from "code/utils/color"
import { addSymbol } from "./addSymbol"

interface Props {
    to: ListWidget | WidgetStack;
    text: string;
    symbol: string;
    textColor?: Color;
    symbolColor?: Color;
    fontSize?: number
}

export const addTextWithSymbolStack = (
    {
        to,
        text,
        symbol,
        textColor = DefaultColor(),
        symbolColor = DefaultColor(),
        fontSize = 20,
    }: Props
) => {
    const _stack = to.addStack()
    _stack.centerAlignContent()

    addSymbol({
        to: _stack,
        symbol,
        size: fontSize,
        color: symbolColor
    })

    _stack.addSpacer(3)

    let _text = _stack.addText(text)
    _text.textColor = textColor;
    _text.font = Font.systemFont(fontSize)

    return _stack;
}
