import { SparkBarImage } from "../images/SparkBarImage"
import { addFlexSpacer } from "../stacks/addFlexSpacer"

interface TextProp {
    text: string;
    color: Color;
}
interface Props {
    series: number[];
    header: TextProp;
    title: TextProp;
    description: TextProp;
    backgroundColor: Color;
    barColor: Color
    lastBarColor: Color;
}

export const SimpleSparkBarWidget = ({ series, header, title, description, backgroundColor, barColor, lastBarColor }: Props) => {
    const widget = new ListWidget()
    widget.backgroundColor = backgroundColor

    // Header
    const headerTxt = widget.addText(header.text)
    headerTxt.textColor = header.color
    headerTxt.font = Font.systemFont(10)

    // Vertical Space
    addFlexSpacer({ to: widget })

    // BarChart (centered)
    const barStack = widget.addStack();
    barStack.layoutHorizontally()
    addFlexSpacer({ to: barStack })
    if (series.length > 0) {
        barStack.addImage(SparkBarImage({
            series,
            color: barColor,
            lastBarColor,
            height: 100,
            width: 400
        }))
    }
    addFlexSpacer({ to: barStack })

    // Vertical Space
    widget.addSpacer(10)

    // Title
    const titleTxt = widget.addText(title.text)
    titleTxt.textColor = title.color
    titleTxt.font = Font.boldSystemFont(16)

    // Vertical space
    widget.addSpacer(2)

    // Description
    const descriptionText = widget.addText(description.text)
    descriptionText.textColor = description.color
    descriptionText.font = Font.systemFont(12)

    return widget
}