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
        addFlexSpacer({ stack: mainStack })
        return widget;

    }
}

const addStatsStack = ({ stack }: { stack: WidgetStack }) => {
    const statsStack = stack.addStack()
    statsStack.centerAlignContent();
    addTextWithSymbolStack({
        stack: statsStack,
        symbol: "person.crop.circle",
        text: "€0,50",
        fontSize: 10,
        color: Color.white()
    })
    addFlexSpacer({ stack: statsStack });
    addTextWithSymbolStack({
        stack: statsStack,
        symbol: "network",
        text: "€11.042,50",
        fontSize: 10,
        color: Color.white()
    })
    statsStack.backgroundColor = new Color(Color.darkGray().hex, 0.8)
    statsStack.setPadding(4, 4, 4, 4)
    statsStack.cornerRadius = 8
    return statsStack;
}


module.exports = widgetModule;

