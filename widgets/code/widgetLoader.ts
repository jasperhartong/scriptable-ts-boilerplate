import { getOrCreateWidgetModule, logToWidget, WidgetModule, widgetModuleDownloadConfig } from "./utils";
const DEBUG = false;
const FORCE_DOWNLOAD = false;
const VERSION = "0.2";

const widgetModulePath = await getOrCreateWidgetModule(widgetModuleDownloadConfig, FORCE_DOWNLOAD)
const widgetModule: WidgetModule = importModule(widgetModulePath)
const widget = await widgetModule.createWidget({
    widgetParameter: args.widgetParameter || widgetModuleDownloadConfig.defaultWidgetParameter,
    debug: DEBUG
});

if (DEBUG) {
    logToWidget(widget, args.widgetParameter)
}

// preview the widget if in app
if (!config.runsInWidget) {
    await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()
