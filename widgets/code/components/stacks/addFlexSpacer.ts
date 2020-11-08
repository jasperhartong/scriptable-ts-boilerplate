interface Props {
    stack: WidgetStack;
}

export const addFlexSpacer = ({ stack }: Props) => {
    // @ts-ignore
    stack.addSpacer(null);
}
