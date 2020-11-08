export interface IWidgetModuleParams {
    widgetParameter: string;
    debug: boolean
}
export interface IWidgetModule {
    createWidget: (params: IWidgetModuleParams) => Promise<ListWidget>;
}

export interface IWidgetModuleDownloadConfig {
    moduleName: string;
    rootUrl: string;
    defaultWidgetParameter: string;
    downloadQueryString: string;
}