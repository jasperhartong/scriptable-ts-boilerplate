interface Props {
    error?: any;
    width?: number;
    height?: number;
}

export const ErrorImage = ({ error, width, height }: Props) => {
    const text = `Image Error: \n ${error?.message || error}`
    const dc = new DrawContext()
    dc.size = new Size(width || 200, height || 200)
    dc.respectScreenScale = true
    dc.opaque = false
    dc.setTextColor(Color.red())
    dc.setFont(Font.semiboldSystemFont(dc.size.width / 10))
    dc.drawText(text, new Point(dc.size.width / 10, 8))
    return dc.getImage()

}