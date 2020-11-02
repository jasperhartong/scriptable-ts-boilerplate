// Based on https://gist.github.com/planecore/e7b4c1e5db2dd28b1a023860e831355e

import { createErrorWidget, createTextWidget, WidgetModule } from "./utils";


const createWidget = async (country?: string) => {
    if (!country) {
        createErrorWidget("No country")
    }
    const url = `https://coronavirus-19-api.herokuapp.com/countries/${country}`
    const req = new Request(url)
    const res = await req.loadJSON()
    return createTextWidget("Coronavirus", `${res.todayCases} Today`, `${res.cases} Total`, "#53d769")
}

const widgetModule: WidgetModule = {
    createWidget: async (params) => {
        return createWidget(params.widgetParameter)
    }
}


export default widgetModule

