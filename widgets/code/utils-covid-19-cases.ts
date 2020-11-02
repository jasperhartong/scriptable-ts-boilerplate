// TODO: Convert to typescript nicely!
function parseCSV(str, len) {
    let arr: [any, any][] = [];
    let quote = false;
    let col, c;
    for (let row = col = c = 0; c < str.length && row < len; c++) {
        let cc = str[c], nc = str[c + 1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }
        arr[row][col] += cc;
    }
    return arr;
}

function arrayHash(arr) {
    let head = arr[0]
    let body = arr.slice(1)
    return body.map(row => {
        return row.reduce((acc, v, i) => {
            let key = head[i]
            acc[key] = v
            return acc
        }, {})
    })
}

async function getData(url, len) {
    let req = new Request(url)
    let txt = await req.loadString()
    let csv = await parseCSV(txt, len)
    return await arrayHash(csv)
}

export const saveData = async () => {
    const url = 'https://covid-sheets-mirror.web.app/api?'
    const sid = '1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk'

    function params(obj) {
        return Object.entries(obj)
            .map(([key, val]) => `${key}=${encodeURI(val as string)}`).join("&")
    }

    const cases = url + params({
        cache: true,
        sheet: sid,
        range: 'Deaths Recoveries!A:H'
    })

    const state = url + params({
        cache: true,
        sheet: sid,
        range: 'Daily Count States!A:E'
    })

    const local = url + params({
        cache: true,
        sheet: sid,
        range: 'Victorian LGAs!A:D'
    })

    const weeks = url + params({
        cache: true,
        sheet: sid,
        range: 'Vic 14 day average!A:E'
    })

    let casesData = await getData(cases, 10)
    let stateData = await getData(state, 28 * 8 + 1)
    let localData = await getData(local, 80)
    let weeksData = await getData(weeks, 2)

    let vicData = stateData.filter(data => data["State/territory"] == "VIC")
    let locData = localData.filter(data => data["LGA"] == "GREATER BENDIGO")

    let graph = stateData.reduce((a, b) => {
        let date = b["Date announced"]
        let cases = parseInt(b["New cases"]) || 0
        if (!a[date]) a[date] = cases
        else a[date] += cases
        return a
    }, {})
    const month = Object.values(graph)
    const t = 7 // 7 day smoothing period
    const sum = (a, b) => a + b
    const tsum = (n) => month.slice(n * t, t + n * t).reduce(sum)
    // @ts-ignore
    const growth = Math.pow(tsum(0) / tsum(1), 1 / t)
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
    }
    let fm = FileManager.iCloud()
    let path = fm.joinPath(fm.documentsDirectory(), "covid19.json")
    fm.writeString(path, JSON.stringify(data))
    return data
}

export function loadData() {
    let fm = FileManager.iCloud()
    let path = fm.joinPath(fm.documentsDirectory(), "covid19.json")
    let data = fm.readString(path)
    return JSON.parse(data)
}


export const columnGraph = (data: any, width: number, height: number, colour: Color) => {
    let max = Math.max(...data)
    let context = new DrawContext()
    context.size = new Size(width, height)
    context.opaque = false
    context.setFillColor(colour)
    data.forEach((value, index) => {
        let w = width / (2 * data.length - 1)
        let h = value / max * height
        let x = width - (index * 2 + 1) * w
        let y = height - h
        let rect = new Rect(x, y, w, h)
        context.fillRect(rect)
    })
    return context
}