import { argsConfig, downloadWidgetModule, logToWidget, WidgetModule } from "./utils";
const DEBUG = false;
const VERSION = "0.2";

const widgetModulePath = await downloadWidgetModule(argsConfig)
const widgetModule: WidgetModule = importModule(widgetModulePath)
const widget = await widgetModule.createWidget({
    widgetParameter: args.widgetParameter || argsConfig.widgetParameter,
    debug: DEBUG
});

if (DEBUG) {
    logToWidget(widget, argsConfig.widgetParameter)
}

// preview the widget if in app
if (!config.runsInWidget) {
    await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()
