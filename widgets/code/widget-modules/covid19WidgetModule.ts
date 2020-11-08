// Based on https://gist.github.com/planecore/e7b4c1e5db2dd28b1a023860e831355e

import { ErrorWidget } from "code/components/ErrorWidget"
import { SimpleTextWidget } from "code/components/SimpleTextWidget"
import { IWidgetModule } from "code/utils/interfaces"



const createWidget = async (country?: string) => {
    if (!country) {
        return ErrorWidget("No country")
    }
    const url = `https://coronavirus-19-api.herokuapp.com/countries/${country}`
    const req = new Request(url)
    const res = await req.loadJSON()
    return SimpleTextWidget("Coronavirus", `${res.todayCases} Today`, `${res.cases} Total`, "#53d769")
}

const widgetModule: IWidgetModule = {
    createWidget: async (params) => {
        return createWidget(params.widgetParameter)
    }
}


module.exports = widgetModule;

