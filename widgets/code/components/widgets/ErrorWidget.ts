import { SimpleTextWidget } from "./SimpleTextWidget"

export const ErrorWidget = (subtitle: string) => {
    return SimpleTextWidget("ERROR", "Widget Error", subtitle, "#000")
}



