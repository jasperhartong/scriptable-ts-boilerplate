import { DefaultColor } from "code/utils/color";
import { getWidgetSizeInPoint } from "code/utils/sizing";

interface Props {
    series: number[],
    width?: number,
    height?: number,
    color?: Color,
    lastBarColor?: Color,
}

export const SparkBarImage = (
    {
        series,
        width,
        height,
        color = DefaultColor(),
        lastBarColor = Color.orange()
    }: Props
) => {
    const widgetSize = getWidgetSizeInPoint()
    const dc = new DrawContext()
    dc.size = new Size(width || widgetSize?.width || 200, height || widgetSize?.height || 200)
    dc.respectScreenScale = true
    dc.opaque = false

    const barColor = color
    const barWidth = (dc.size.width) / series.length - 4
    const maxValue = Math.max(...series);
    // Calculate the rendered height of the bars, make sure they're at least 1 pixel
    const pixelMultiplier = dc.size.height / maxValue;
    const pixelValues = series.map(v => Math.max(v * pixelMultiplier, 1));

    // Draw the bars
    pixelValues.forEach((v, i) => {
        dc.setFillColor(i === pixelValues.length - 1 ? lastBarColor : barColor)
        const x = (dc.size.width * i / pixelValues.length)
        const barHeight = v;
        const y = dc.size.height - barHeight
        dc.fillRect(new Rect(x, y, barWidth, barHeight))
    });

    const image = dc.getImage()

    return image
}