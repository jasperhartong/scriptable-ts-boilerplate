// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: user-md;

import { createErrorWidget, createTextWidget, getDataWithSecret, presentErrorWidget } from "./utils";

interface WidgetFields {
    pretitle: string;
    title: string;
    subtitle: string;
    color: string;
}

getDataWithSecret<WidgetFields>(secret => `http://macbook-pro.local:3000/api/ios-widgets/${secret}/own`)
    .then(async (r) => {
        if (config.runsInWidget) {
            const widget = r.ok
                ? createTextWidget(r.data.pretitle, r.data.title, r.data.subtitle, r.data.color)
                : createErrorWidget();

            Script.setWidget(widget)
            Script.complete()
        } else {
            if (!r.ok) {
                return await presentErrorWidget()
            }

            const { pretitle, title, subtitle, color } = r.data
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
