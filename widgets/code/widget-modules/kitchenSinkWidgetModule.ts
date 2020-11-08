import { SparkBarImage } from "code/components/SparkBarImage";
import { addFlexSpacer } from "code/components/stacks/addFlexSpacer";
import { addTextWithSymbolStack } from "code/components/stacks/addTextWithSymbolStack";
import { UnsplashImage } from "code/components/UnsplashImage";
import { IWidgetModule } from "code/utils/interfaces";


const widgetModule: IWidgetModule = {
    createWidget: async (params) => {
        const widget = new ListWidget();
        widget.setPadding(8, 0, 0, 0)
        widget.backgroundImage = await UnsplashImage({ id: "KuF8-6EbBMs", width: 800, height: 800 });


        const mainStack = widget.addStack();
        mainStack.layoutVertically();

        addFlexSpacer({ to: mainStack })

        // Start Content
        const contentStack = mainStack.addStack()
        contentStack.layoutVertically();
        contentStack.setPadding(0, 16, 0, 16)

        contentStack.addImage(SparkBarImage({
            series: [800_000, 780_000, 760_000, 738_000, 680_000, 650_000, 600_000, 554_600, 500_000, 438_000],
            width: 400,
            height: 100,
            color: new Color(Color.white().hex, 0.6),
            lastBarColor: Color.orange()
        }))

        contentStack.addSpacer(8)

        let title = contentStack.addText("438.000 cases")
        title.textColor = Color.orange()
        title.font = Font.semiboldSystemFont(14)

        contentStack.addSpacer(2)

        let _text = contentStack.addText("A 50% decrease in the last 10 years")
        _text.textColor = Color.white()
        _text.font = Font.systemFont(12)
        // End Content

        addFlexSpacer({ to: mainStack })

        // Footer
        addStatsStack({ stack: mainStack })


        return widget;

    }
}

const addStatsStack = ({ stack }: { stack: WidgetStack }) => {
    const statsStack = stack.addStack()
    statsStack.centerAlignContent();
    statsStack.backgroundColor = new Color(Color.black().hex, 0.85)
    statsStack.setPadding(6, 16, 6, 16)

    addTextWithSymbolStack({
        to: statsStack,
        symbol: "person.crop.circle",
        text: "0,50",
        fontSize: 10,
        textColor: Color.lightGray(),
        symbolColor: Color.lightGray()
    })
    addFlexSpacer({ to: statsStack });
    addTextWithSymbolStack({
        to: statsStack,
        symbol: "network",
        text: "11K",
        fontSize: 10,
        textColor: Color.lightGray(),
        symbolColor: Color.lightGray()
    })
    return statsStack;
}


module.exports = widgetModule;

