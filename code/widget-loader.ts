// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: download;
import { downloadWidgetModule, WidgetModule } from "./utils";

const DEBUG = false;


downloadWidgetModule({
    name: "emittime-script-own-module",
    rootUrl: "https://gist.githubusercontent.com/jasperhartong/bf2c113b53e770b54f9fdd9502d6c64e/raw/b3d08c4513f8a01a462e63bd4a0985cffab69b94/"
})
    .then(async widgetModulePath => {
        // import downloaded widgetModule
        const widgetModule: WidgetModule = importModule(widgetModulePath)
        // create the widget
        const params = {
            widgetParameter: args.widgetParameter,
            debug: DEBUG
        }
        const widget = await widgetModule.createWidget(params)

        // preview the widget
        if (!config.runsInWidget) {
            await widget.presentSmall()
        }

        Script.setWidget(widget)
        Script.complete()
    })






