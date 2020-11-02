export interface WidgetModule {
    rawScript: string;
    fileName: string;
    imageSrc: string;
    meta: {
        name: string;
        paramLabel: string;
        paramPlaceHolder: string;
        description: string;
        loaderArgs: WidgetLoaderArgs;
    }
}

export interface WidgetLoaderArgs {
    iconColor: string;
    iconGlyph: string;
}