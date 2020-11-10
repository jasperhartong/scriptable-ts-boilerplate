import { SimpleSparkBarWidget } from "code/components/widgets/SimpleSparkBarWidget";
import { IWidgetModule } from "code/utils/interfaces";
import { RequestWithTimeout } from "code/utils/request-utils";

const widgetModule: IWidgetModule = {
    createWidget: async (params) => {
        const { website, apiKey } = parseWidgetParameter(params.widgetParameter)

        // Styling
        const highlightColor = new Color("#b93545", 1.0)
        const textColor = new Color("#a4bdc0", 1.0)
        const backgroundColor = new Color("#20292a", 1)
        const barColor = new Color("#198c9f", 1)

        // Fallback data
        let series: number[] = []
        let titleText = "No data"
        let descriptionText = "Check the parameter settings"

        // Load data
        const data = await requestSimpleAnalyticsData({ website, apiKey })
        if (data) {
            const pageViewsToday = data.visits[data.visits.length - 1]?.pageviews || 0
            series = data.visits.map(visit => visit.pageviews)
            titleText = `${pageViewsToday} views`
            descriptionText = `${data.pageviews} this month`
        }

        const widget = SimpleSparkBarWidget({
            series,
            header: { text: website, color: textColor },
            title: { text: titleText, color: highlightColor },
            description: { text: descriptionText, color: textColor },
            backgroundColor,
            barColor,
            lastBarColor: highlightColor,
        })

        if (website) {
            // Open Simple Analytics stats when tapped
            widget.url = `https://simpleanalytics.com/${website}`
        }

        return widget
    }
}

module.exports = widgetModule;

// SimpleAnalytics helpers
const parseWidgetParameter = (param: string) => {
    // handles: <apiKey>@<website> || @<website> || <website>
    const paramParts = param.toLowerCase().replace(/ /g, "").split("@")
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