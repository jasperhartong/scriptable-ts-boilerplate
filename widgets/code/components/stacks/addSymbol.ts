import { DefaultColor } from "code/utils/color"

interface Props {
    to: ListWidget | WidgetStack;
    symbol?: string;
    color?: Color;
    size?: number
}

export const addSymbol = (
    {
        to,
        symbol = 'applelogo',
        color = DefaultColor(),
        size = 20,
    }: Props
) => {
    const _sym = SFSymbol.named(symbol)
    const wImg = to.addImage(_sym.image)
    wImg.tintColor = color
    wImg.imageSize = new Size(size, size)
}
