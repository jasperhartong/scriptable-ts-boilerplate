// TODO: Convert to typescript nicely!
function parseCSV(str, len) {
    let arr = [];
    let quote = false;
    let col, c;
    for (let row = col = c = 0; c < str.length && row < len; c++) {
        let cc = str[c], nc = str[c + 1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';
        if (cc == '"' && quote && nc == '"') {
            arr[row][col] += cc;
            ++c;
            continue;
        }
        if (cc == '"') {
            quote = !quote;
            continue;
        }
        if (cc == ',' && !quote) {
            ++col;
            continue;
        }
        if (cc == '\r' && nc == '\n' && !quote) {
            ++row;
            col = 0;
            ++c;
            continue;
        }
        if (cc == '\n' && !quote) {
            ++row;
            col = 0;
            continue;
        }
        if (cc == '\r' && !quote) {
            ++row;
            col = 0;
            continue;
        }
        arr[row][col] += cc;
    }
    return arr;
}
function arrayHash(arr) {
    let head = arr[0];
    let body = arr.slice(1);
    return body.map(row => {
        return row.reduce((acc, v, i) => {
            let key = head[i];
            acc[key] = v;
            return acc;
        }, {});
    });
}
async function getData(url, len) {
    let req = new Request(url);
    let txt = await req.loadString();
    let csv = await parseCSV(txt, len);
    return await arrayHash(csv);
}
const saveData = async () => {
    const url = 'https://covid-sheets-mirror.web.app/api?';
    const sid = '1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk';
    function params(obj) {
        return Object.entries(obj)
            .map(([key, val]) => `${key}=${encodeURI(val)}`).join("&");
    }
    const cases = url + params({
        cache: true,
        sheet: sid,
        range: 'Deaths Recoveries!A:H'
    });
    const state = url + params({
        cache: true,
        sheet: sid,
        range: 'Daily Count States!A:E'
    });
    const local = url + params({
        cache: true,
        sheet: sid,
        range: 'Victorian LGAs!A:D'
    });
    const weeks = url + params({
        cache: true,
        sheet: sid,
        range: 'Vic 14 day average!A:E'
    });
    let casesData = await getData(cases, 10);
    let stateData = await getData(state, 28 * 8 + 1);
    let localData = await getData(local, 80);
    let weeksData = await getData(weeks, 2);
    let vicData = stateData.filter(data => data["State/territory"] == "VIC");
    let locData = localData.filter(data => data["LGA"] == "GREATER BENDIGO");
    let graph = stateData.reduce((a, b) => {
        let date = b["Date announced"];
        let cases = parseInt(b["New cases"]) || 0;
        if (!a[date])
            a[date] = cases;
        else
            a[date] += cases;
        return a;
    }, {});
    const month = Object.values(graph);
    const t = 7; // 7 day smoothing period
    const sum = (a, b) => a + b;
    const tsum = (n) => month.slice(n * t, t + n * t).reduce(sum);
    // @ts-ignore
    const growth = Math.pow(tsum(0) / tsum(1), 1 / t);
    let data = {
        "stats": {
            "Growth factor": growth.toFixed(2),
            "Regional 14 day avg": weeksData[0]["Regional Average"],
            "Metro 14 day average": weeksData[0]["Metro Average"],
            "Local active cases": locData[0]["Active Cases"],
            "Local total cases": locData[0]["Total Cases"],
            "Victoria new cases": vicData[0]["New cases"],
            "Victoria active cases": casesData.filter(data => data["State/territory"] == "VIC")[0]["Current"],
            "Victoria total cases": vicData[0]["Cumulative confirmed"],
            // @ts-ignore
            "Australia new cases": Object.values(graph)[0].toString(),
            "Australia active cases": casesData[0]["Current"],
            "Australia total cases": casesData[0]["Confirmed (total)"],
            "Australia total deaths": casesData[0]["Deceased"]
        },
        "widget": {
            "14d": `${weeksData[0]["Metro Average"]} (M) ${weeksData[0]["Regional Average"]} (R)`,
            "BGO": `${locData[0]["Total Cases"]} (${locData[0]["Active Cases"]} active)`,
            "VIC": `${vicData[0]["Cumulative confirmed"]} (+${vicData[0]["New cases"]})`,
            // @ts-ignore
            "AUS": `${casesData[0]["Confirmed (total)"]} (+${Object.values(graph)[0].toString()})`
        },
        "graph": month,
        "date": casesData[0]["Date"],
        "growth": growth
    };
    let fm = FileManager.iCloud();
    let path = fm.joinPath(fm.documentsDirectory(), "covid19.json");
    fm.writeString(path, JSON.stringify(data));
    return data;
};
const columnGraph = (data, width, height, colour) => {
    let max = Math.max(...data);
    let context = new DrawContext();
    context.size = new Size(width, height);
    context.opaque = false;
    context.setFillColor(colour);
    data.forEach((value, index) => {
        let w = width / (2 * data.length - 1);
        let h = value / max * height;
        let x = width - (index * 2 + 1) * w;
        let y = height - h;
        let rect = new Rect(x, y, w, h);
        context.fillRect(rect);
    });
    return context;
};

// Variables used by Scriptable.
const createWidget = async (note) => {
    let data = await saveData();
    let widget = new ListWidget();
    let now = new Date();
    now.setHours(now.getHours() + 12);
    widget.refreshAfterDate = now;
    // widget.setPadding(16, 16, 16, 16)
    widget.useDefaultPadding();
    try {
        function gradient(start, end) {
            let startColor = new Color(start, 1);
            let endColor = new Color(end, 1);
            let gradient = new LinearGradient();
            gradient.colors = [startColor, endColor];
            gradient.locations = [0.0, 1];
            widget.backgroundGradient = gradient;
        }
        let growth = data["growth"];
        if (growth < 1)
            gradient("37c25a", "1cb943");
        else
            gradient("ee676c", "eb5056");
        let header = widget.addStack();
        let headText = header.addText("COVID-19");
        headText.textColor = Color.white();
        headText.font = Font.boldSystemFont(10);
        headText.minimumScaleFactor = 0.5;
        // @ts-ignore
        header.addSpacer(null);
        let dateText = header.addText(data["date"]);
        dateText.textColor = Color.white();
        dateText.textOpacity = 0.8;
        dateText.font = Font.regularSystemFont(10);
        dateText.minimumScaleFactor = 0.5;
        let image = columnGraph(data["graph"], 400, 100, Color.white()).getImage();
        widget.addImage(image).applyFillingContentMode();
        let growText = widget.addText(`growth ${data["stats"]["Growth factor"]}`);
        growText.rightAlignText();
        growText.textColor = Color.white();
        growText.textOpacity = 0.8;
        growText.font = Font.regularSystemFont(10);
        growText.minimumScaleFactor = 0.5;
        // @ts-ignore
        header.addSpacer(null);
        Object.entries(data["widget"]).forEach(([key, value]) => {
            let stack = widget.addStack();
            stack.spacing = 5;
            let labelText = stack.addText(key);
            labelText.textColor = Color.white();
            labelText.textOpacity = 0.6;
            labelText.font = Font.regularSystemFont(12);
            labelText.minimumScaleFactor = 0.5;
            // @ts-ignore
            let bodyText = stack.addText(value);
            bodyText.textColor = Color.white();
            bodyText.font = Font.regularSystemFont(12);
            bodyText.minimumScaleFactor = 0.5;
        });
    }
    catch (error) {
        console.error(error);
    }
    return widget;
};
const widgetModule = {
    createWidget: async (params) => {
        return createWidget(params.widgetParameter);
    }
};

module.exports = widgetModule;
