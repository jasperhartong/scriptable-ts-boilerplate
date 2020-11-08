export const logToWidget = (widget: ListWidget, message: string) => {
    console.log(message)
    let a = widget.addText(message)
    a.textColor = Color.red()
    a.textOpacity = 0.8
    a.font = Font.systemFont(10)
}