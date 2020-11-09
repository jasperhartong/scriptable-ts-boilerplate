// Based on https://gist.github.com/planecore/e7b4c1e5db2dd28b1a023860e831355e

import { ErrorWidget } from "code/components/widgets/ErrorWidget"
import { SimpleTextWidget } from "code/components/widgets/SimpleTextWidget"
import { IWidgetModule } from "code/utils/interfaces"
import { RequestWithTimeout } from "code/utils/request-utils"

const createWidget = async (country?: string) => {
    if (!country) {
        return ErrorWidget("No country")
    }
    const url = `https://coronavirus-19-api.herokuapp.com/countries/${country}`
    const req = RequestWithTimeout(url)
    const res = await req.loadJSON()
    return SimpleTextWidget("Coronavirus", `${res.todayCases} Today`, `${res.cases} Total`, "#53d769")
}

const widgetModule: IWidgetModule = {
    createWidget: async (params) => {
        return createWidget(params.widgetParameter)
    }
}


module.exports = widgetModule;

