import { SparkBarImage } from "code/components/images/SparkBarImage";
import { addFlexSpacer } from "code/components/stacks/addFlexSpacer";
import { IWidgetModule } from "code/utils/interfaces";
import { RequestWithTimeout } from "code/utils/request-utils";


const widgetModule: IWidgetModule = {
    createWidget: async (params) => {
        const widget = new ListWidget()
        // Ensure there's always a site set
        const website = params.widgetParameter || `simpleanalytics.com`
        const data = await requestSimpleAnalyticsData(website)
        // TODO: render something if no website is found
        const highlightColor = new Color("#b93545", 1.0)
        const textColor = new Color("#a4bdc0", 1.0)
        const backgroundColor = new Color("#20292a", 1)
        const graphColor = new Color("#198c9f", 1)
        const pageViewsToday = data.visits[data.visits.length - 1]?.pageviews || 0
        const pageViewsYesterday = data.visits[data.visits.length - 2]?.pageviews || 0
        const pageViewsChange = pageViewsToday - pageViewsYesterday


        // General widget config
        widget.backgroundColor = backgroundColor

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
        barStack.addImage(SparkBarImage({
            series: data.visits.map(visit => visit.pageviews),
            color: graphColor,
            lastBarColor: highlightColor,
            height: 100,
            width: 400
        }))
        addFlexSpacer({ to: barStack })

        // Vertical Space
        widget.addSpacer(10)

        // Title: Today
        const titleTxt = widget.addText(`${pageViewsToday} today`)
        titleTxt.textColor = highlightColor
        titleTxt.font = Font.boldSystemFont(16)

        // Vertical space
        widget.addSpacer(2)

        // Description: Change since yesterday
        const descriptionText = widget.addText(`${pageViewsChange >= 0 ? "+" : ""}${pageViewsChange} page views`)
        descriptionText.textColor = textColor
        descriptionText.font = Font.systemFont(12)

        // create the widget
        return widget
    }
}

module.exports = widgetModule;

// helpers
const formatDateQueryParam = (date: Date) =>
    date.toISOString().split('T')[0]

const requestSimpleAnalyticsData = async (website: string) => {
    const today = new Date()
    const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 6))
    const url = `https://simpleanalytics.com/${website}.json?version=2&start=${formatDateQueryParam(sevenDaysAgo)}&end=${formatDateQueryParam(today)}`
    const req = RequestWithTimeout(url)
    // TODO: check if error result
    const data = (await req.loadJSON()) as SimpleanalyticsData;
    return data;
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