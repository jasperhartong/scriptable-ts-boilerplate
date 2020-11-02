import { argsConfig, downloadWidgetModule, WidgetModule } from "./utils";
const DEBUG = false;

downloadWidgetModule(argsConfig)
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






