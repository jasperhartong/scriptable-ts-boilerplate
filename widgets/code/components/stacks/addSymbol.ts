interface Props {
    stack: WidgetStack;
    symbol?: string;
    color?: Color;
    size?: number
}

export const addSymbol = (
    {
        stack,
        symbol = 'applelogo',
        color = Color.white(),
        size = 20,
    }: Props
) => {
    const _sym = SFSymbol.named(symbol)
    const wImg = stack.addImage(_sym.image)
    wImg.tintColor = color
    wImg.imageSize = new Size(size, size)
}
