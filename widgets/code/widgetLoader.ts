import { logToWidget } from "code/utils/debug-utils";
import { IWidgetModule } from "code/utils/interfaces";
import { getOrCreateWidgetModule, widgetModuleDownloadConfig } from "code/utils/widget-loader-utils";

const DEBUG = false;
const FORCE_DOWNLOAD = false;
const VERSION = "0.2";

const widgetModulePath = await getOrCreateWidgetModule(widgetModuleDownloadConfig, FORCE_DOWNLOAD)
const widgetModule: IWidgetModule = importModule(widgetModulePath)
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
