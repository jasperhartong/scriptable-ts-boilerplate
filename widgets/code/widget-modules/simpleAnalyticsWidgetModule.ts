import { SparkBarImage } from "code/components/images/SparkBarImage";
import { addFlexSpacer } from "code/components/stacks/addFlexSpacer";
import { IWidgetModule } from "code/utils/interfaces";
import { RequestWithTimeout } from "code/utils/request-utils";


const widgetModule: IWidgetModule = {
    createWidget: async (params) => {
        const widget = new ListWidget()
        const { website, apiKey } = parseWidgetParameter(params.widgetParameter)

        // Styling
        const highlightColor = new Color("#b93545", 1.0)
        const textColor = new Color("#a4bdc0", 1.0)
        const backgroundColor = new Color("#20292a", 1)
        const graphColor = new Color("#198c9f", 1)

        // Fallback data
        let series: number[] = []
        let title = "No data"
        let description = "Check the parameter settings"

        // Load data
        const data = await requestSimpleAnalyticsData({ website, apiKey })
        if (data) {
            const pageViewsToday = data.visits[data.visits.length - 1]?.pageviews || 0
            series = data.visits.map(visit => visit.pageviews)
            title = `${pageViewsToday} views`
            description = `${data.pageviews} last month`
        }

        // General widget config
        widget.backgroundColor = backgroundColor

        /* Widget Layout */

        // Header
        const headerTxt = widget.addText(website)
        headerTxt.textColor = textColor
        headerTxt.font = Font.systemFont(10)

        // Vertical Space
        addFlexSpacer({ to: widget })

        // BarChart (centered)
        const barStack = widget.addStack();
        barStack.layoutHorizontally()
        addFlexSpacer({ to: barStack })
        if (series.length > 0) {
            barStack.addImage(SparkBarImage({
                series,
                color: graphColor,
                lastBarColor: highlightColor,
                height: 100,
                width: 400
            }))
        }
        addFlexSpacer({ to: barStack })

        // Vertical Space
        widget.addSpacer(10)

        // Title: Today
        const titleTxt = widget.addText(title)
        titleTxt.textColor = highlightColor
        titleTxt.font = Font.boldSystemFont(16)

        // Vertical space
        widget.addSpacer(2)

        // Description: Change since yesterday
        const descriptionText = widget.addText(description)
        descriptionText.textColor = textColor
        descriptionText.font = Font.systemFont(12)

        // create the widget
        return widget
    }
}

module.exports = widgetModule;

// helpers
const parseWidgetParameter = (param: string) => {
    // handles: <apiKey>@<website> || @<website> || <website>
    const paramParts = param.split("@")
    let apiKey: string = "";
    let website: string = "";

    switch (paramParts.length) {
        case 1: [website] = paramParts; break;
        case 2: [apiKey, website] = paramParts; break;
    }

    return { apiKey, website }
}

const formatDateQueryParam = (date: Date) =>
    date.toISOString().split('T')[0]

interface SimpleAnalyticsDataRequest {
    website: string;
    apiKey: string;
    daysAgo?: number
}
const requestSimpleAnalyticsData = async (
    { website, apiKey, daysAgo = 31 }: SimpleAnalyticsDataRequest
): Promise<SimpleanalyticsData | null> => {
    const today = new Date()
    const startDate = new Date(new Date().setDate(today.getDate() - daysAgo))
    const url = `https://simpleanalytics.com/${website}.json?version=2&start=${formatDateQueryParam(startDate)}&end=${formatDateQueryParam(today)}`
    const req = RequestWithTimeout(url)
    if (apiKey) {
        req.headers = { "Api-Key": apiKey }
    }
    const data = await req.loadJSON();
    return req.response.statusCode === 200 ? data as SimpleanalyticsData : null;
}

// interfaces
type DeviceType = "mobile" | "desktop" | "tablet";

interface SimpleanalyticsData {
    docs: string;
    hostname: string;
    url: string;
    start: string;
    end: string;
    ok: boolean;
    error: null;
    version: number;
    path: string;
    pageviews: number;
    agents: {
        count: number;
        browser_name: string;
        browser_version: string;
        os_name: string;
        os_version: string;
        type: DeviceType;
    };
    visits: {
        date: string;
        pageviews: number;
        uniques: number;
    }[];
    pages: {
        value: string;
        visits: number;
        uniqueVisits: number;
    }[];
    countries: {
        value: string;
        visits: number;
        uniqueVisits: number;
    }[];
    referrers: {
        value: string;
        visits: number;
        uniqueVisits: number;
    }[];
    browser_names: {
        value: string;
        visits: number;
        uniqueVisits: number;
    }[];
    os_names: {
        value: string;
        visits: number;
        uniqueVisits: number;
    }[];
    device_types: {
        value: DeviceType;
        visits: number;
        uniqueVisits: number;
    }[];
    // missing utm stuff
}