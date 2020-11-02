// Based on https://github.com/drewkerr/scriptable/blob/main/Sticky%20widget.js

import { WidgetModule } from "./utils";


const createWidget = (note: string) => {
    let widget = new ListWidget()
    widget.setPadding(16, 16, 16, 8)
    let dark = Device.isUsingDarkAppearance()
    let fgColor = Color.black()
    if (dark) {
        fgColor = new Color("#FFCF00", 1)
        let bgColor = Color.black()
        widget.backgroundColor = bgColor
    } else {
        let startColor = new Color("#F8DE5F", 1)
        let endColor = new Color("#FFCF00", 1)
        let gradient = new LinearGradient()
        gradient.colors = [startColor, endColor]
        gradient.locations = [0.0, 1]
        widget.backgroundGradient = gradient
    }
    let noteText = widget.addText(note)
    noteText.textColor = fgColor
    noteText.font = Font.mediumRoundedSystemFont(24)
    noteText.textOpacity = 0.8
    noteText.minimumScaleFactor = 0.25
    return widget
}

const widgetModule: WidgetModule = {
    createWidget: async (params) => {
        return createWidget(params.widgetParameter)
    }
}

module.exports = widgetModule;