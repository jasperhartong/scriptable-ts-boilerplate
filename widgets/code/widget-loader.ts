// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: __iconColor__; icon-glyph: __iconGlyph__;
import { downloadWidgetModule, WidgetModule } from "./utils";

const DEBUG = false;


downloadWidgetModule({
    name: "__name__",
    rootUrl: "__rootUrl__"
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






