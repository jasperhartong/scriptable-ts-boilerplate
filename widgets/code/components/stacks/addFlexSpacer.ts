interface Props {
    to: ListWidget | WidgetStack;
}

export const addFlexSpacer = ({ to }: Props) => {
    // @ts-ignore
    to.addSpacer();
}
