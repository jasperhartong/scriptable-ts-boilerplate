// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: user-md;

import { createErrorWidget, createTextWidget, getDataWithSecret, WidgetModule } from "./utils";

interface WidgetFields {
    pretitle: string;
    title: string;
    subtitle: string;
    color: string;
}

const widgetModule: WidgetModule = {
    createWidget: async (params) => {
        const response = await getDataWithSecret<WidgetFields>(secret => `https://emittime.app/api/ios-widgets/${secret}/own`)

        if (!response.ok) {
            return createErrorWidget("")
        }
        const { pretitle, title, subtitle, color } = response.data;
        return createTextWidget(pretitle, title, subtitle, color)
    }
}


export default widgetModule

