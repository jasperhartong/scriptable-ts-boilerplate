// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: user-md;

// Based on https://github.com/drewkerr/scriptable/blob/main/COVID-19%20Cases.js

import { WidgetModule } from "./utils";
import { columnGraph, saveData } from "./utils-covid-19-cases";


const createWidget = async (note: string) => {
    let data = await saveData()
    let widget = new ListWidget()
    let now = new Date()
    now.setHours(now.getHours() + 12)
    widget.refreshAfterDate = now
    // widget.setPadding(16, 16, 16, 16)
    widget.useDefaultPadding()

    try {
        function gradient(start, end) {
            let startColor = new Color(start, 1)
            let endColor = new Color(end, 1)
            let gradient = new LinearGradient()
            gradient.colors = [startColor, endColor]
            gradient.locations = [0.0, 1]
            widget.backgroundGradient = gradient
        }

        let growth = data["growth"]
        if (growth < 1) gradient("37c25a", "1cb943")
        else gradient("ee676c", "eb5056")

        let header = widget.addStack()
        let headText = header.addText("COVID-19")
        headText.textColor = Color.white()
        headText.font = Font.boldSystemFont(10)
        headText.minimumScaleFactor = 0.5
        // @ts-ignore
        header.addSpacer(null)
        let dateText = header.addText(data["date"])
        dateText.textColor = Color.white()
        dateText.textOpacity = 0.8
        dateText.font = Font.regularSystemFont(10)
        dateText.minimumScaleFactor = 0.5

        let image = columnGraph(data["graph"], 400, 100, Color.white()).getImage()
        widget.addImage(image).applyFillingContentMode()
        let growText = widget.addText(`growth ${data["stats"]["Growth factor"]}`)
        growText.rightAlignText()
        growText.textColor = Color.white()
        growText.textOpacity = 0.8
        growText.font = Font.regularSystemFont(10)
        growText.minimumScaleFactor = 0.5

        // @ts-ignore
        header.addSpacer(null)

        Object.entries(data["widget"]).forEach(([key, value]) => {
            let stack = widget.addStack()
            stack.spacing = 5
            let labelText = stack.addText(key)
            labelText.textColor = Color.white()
            labelText.textOpacity = 0.6
            labelText.font = Font.regularSystemFont(12)
            labelText.minimumScaleFactor = 0.5
            // @ts-ignore
            let bodyText = stack.addText(value)
            bodyText.textColor = Color.white()
            bodyText.font = Font.regularSystemFont(12)
            bodyText.minimumScaleFactor = 0.5
        })
    } catch (error) {
        console.error(error)
    }

    return widget
}

const widgetModule: WidgetModule = {
    createWidget: async (params) => {
        return createWidget(params.widgetParameter)
    }
}


export default widgetModule

