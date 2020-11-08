import { SimpleTextWidget } from "code/components/widgets/SimpleTextWidget"

export const ErrorWidget = (subtitle: string) => {
    return SimpleTextWidget("ERROR", "Widget Error", subtitle, "#000")
}



