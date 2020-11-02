// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: user-md;

// Based on https://github.com/drewkerr/scriptable/blob/main/Sticky%20widget.js

import { WidgetModule } from "./utils";

interface WidgetFields {
    pretitle: string;
    title: string;
    subtitle: string;
    color: string;
}

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
    return widget;
}

const widgetModule: WidgetModule = {
    createWidget: async (params) => {
        return createWidget(params.widgetParameter)
    }
}


export default widgetModule

