import { SimpleBarChartImage } from "code/components/SimpleBarChartImage";
import { addFlexSpacer } from "code/components/stacks/addFlexSpacer";
import { addTextWithSymbolStack } from "code/components/stacks/addTextWithSymbolStack";
import { UnsplashImage } from "code/components/UnsplashImage";
import { IWidgetModule } from "code/utils/interfaces";


const widgetModule: IWidgetModule = {
    createWidget: async (params) => {
        const widget = new ListWidget();
        widget.backgroundImage = await UnsplashImage({ id: "Bkci_8qcdvQ", width: 800, height: 800 });

        const mainStack = widget.addStack();
        mainStack.layoutVertically();

        addStatsStack({ stack: mainStack })
        mainStack.addSpacer(4)
        addFlexSpacer({ to: mainStack })


        const barChartStack = mainStack.addStack();
        barChartStack.layoutHorizontally()
        barChartStack.topAlignContent()
        addFlexSpacer({ to: barChartStack })


        barChartStack.addImage(SimpleBarChartImage({
            series: [800_000, 780_000, 760_000, 738_000, 680_000, 600_000, 554_600, 438_000],
            width: 300,
            height: 200,
            color: new Color(Color.white().hex, 0.8)
        }))
        addFlexSpacer({ to: barChartStack })

        mainStack.addSpacer(4)

        let _text = mainStack.addText("50% decrease of cases since 2010")
        _text.centerAlignText()
        _text.textColor = new Color(Color.white().hex, 0.8);
        _text.font = Font.systemFont(12)


        return widget;

    }
}

const addStatsStack = ({ stack }: { stack: WidgetStack }) => {
    const statsStack = stack.addStack()
    statsStack.centerAlignContent();
    addTextWithSymbolStack({
        to: statsStack,
        symbol: "person.crop.circle",
        text: "€0,50",
        fontSize: 10,
        textColor: Color.white(),
        symbolColor: Color.white()
    })
    addFlexSpacer({ to: statsStack });
    addTextWithSymbolStack({
        to: statsStack,
        symbol: "network",
        text: "€11K",
        fontSize: 10,
        textColor: Color.white(),
        symbolColor: Color.white()
    })
    statsStack.backgroundColor = new Color(Color.darkGray().hex, 0.8)
    statsStack.setPadding(4, 4, 4, 4)
    statsStack.cornerRadius = 8
    return statsStack;
}


module.exports = widgetModule;

