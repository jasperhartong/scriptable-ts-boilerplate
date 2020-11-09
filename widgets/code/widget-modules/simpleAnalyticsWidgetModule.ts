import { SparkBarImage } from "code/components/images/SparkBarImage";
import { IWidgetModule } from "code/utils/interfaces";
import { RequestWithTimeout } from "code/utils/request-utils";


const widgetModule: IWidgetModule = {
    createWidget: async (params) => {
        const widget = new ListWidget()
        const website = params.widgetParameter || `scriptable-ts-boilerplate.vercel.app`
        const data = await requestSimpleAnalyticsData(website)
        // TODO: render something if no website is found

        widget.backgroundColor = Color.lightGray()
        widget.addImage(SparkBarImage({
            series: data.visits.map(visit => visit.pageviews)
        }))

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