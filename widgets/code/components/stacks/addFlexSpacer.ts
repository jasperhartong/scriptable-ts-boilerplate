interface Props {
  to: ListWidget | WidgetStack;
}

export const addFlexSpacer = ({ to }: Props) => {
  to.addSpacer();
};
