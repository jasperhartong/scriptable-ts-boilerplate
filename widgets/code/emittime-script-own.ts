// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: user-md;

import { createTextWidget, getDataWithSecret, handleError } from "./utils";

interface WidgetFields {
    pretitle: string;
    title: string;
    subtitle: string;
    color: string;
}

getDataWithSecret<WidgetFields>(secret => `https://emittime.app/api/ios-widgets/${secret}/own`)
    .then(async (response) => {
        if (!response.ok) {
            await handleError()
            return;
        }
        const { pretitle, title, subtitle, color } = response.data

        if (config.runsInWidget) {
            const widget = createTextWidget(pretitle, title, subtitle, color)
            Script.setWidget(widget)
        } else {

            // make table
            let table = new UITable()


            // add header
            let row = new UITableRow()
            row.isHeader = true
            row.addText(`Emit/Time`)
            table.addRow(row)

            // fill data
            table.addRow(createRow(title, 0))

            if (config.runsWithSiri)
                Speech.speak(`${title}`)

            // present table
            table.present()

        }
    })


function createRow(title: string, number: number) {
    let row = new UITableRow()
    row.addText(title)
    row.addText(number.toString()).rightAligned()
    return row
}
