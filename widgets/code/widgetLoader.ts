import { argsConfig, downloadWidgetModule, WidgetModule } from "./utils";
const DEBUG = false;
const VERSION = "0.1";

downloadWidgetModule(argsConfig)
    .then(async widgetModulePath => {
        // import downloaded widgetModule
        const widgetModule: WidgetModule = importModule(widgetModulePath)
        // create the widget
        const params = {
            widgetParameter: args.widgetParameter || argsConfig.widgetParameter,
            debug: DEBUG
        }
        const widget = await widgetModule.createWidget(params)
        // widget.url = "TODO: allow to set url in argsConfig"

        // preview the widget
        if (!config.runsInWidget) {
            await widget.presentSmall()
        }

        Script.setWidget(widget)
        Script.complete()
    })






