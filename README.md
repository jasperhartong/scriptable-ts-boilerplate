# Scriptable TS Boilerplate

Makes creating iOS widgets with the [Scriptable App](https://scriptable.app/) even more fun!

- 🔥 Hot-loading widgets served by Next.js
- 🔨 The safety of TypeScript
- 🍭 Build, compile, rollup and other configs
- 🚀 Deploy to Vercel with ease
- ✨ Roll out updates to live widgets automatically

_Note: This is a work in progress_

**[Scriptable TS Boilerplate Website →](https://scriptable-ts-boilerplate.vercel.app)**

## Project structure

This boilerplate consists of two separate packages **widgets** and **scriptable-api**. 

### Widgets

Houses the dependencies, rollup config and code to write hot-loading widgets in TypeScript.

All created `WidgetModules` are currently build to be loaded and bootstrapped by the `WidgetLoader`.

### Scriptable-api

A Nextjs project to serve the compiled `WidgetModules` and `WidgetLoader`. Also houses the demo website and can also be used to create custom data endpoints for the widgets.

### Data exchange between projects

The only way data is shared between the two is through the compilation process of **widgets**: this outputs compiled js files into a subdirectory of **scriptable-api**.


# Local development

## Writing and compiling a new widget

Start with creating a new widgetModule in `./widgets/code/widget-module` that complies to the following convention:

```js camelCasedNameEndingOnWidgetModule.ts
import { IWidgetModule } from "code/utils/interfaces";

const widgetModule: IWidgetModule = {
    createWidget: async (params) => {
        const widget = new ListWidget()
        // await data
        // do something with `params.widgetParameter`
        // create the widget
        return widget
    }
}

module.exports = widgetModule;
```

Compile your widget by running either `yarn build` or `yarn watch` in `./widgets` (any file ending with `WidgetModule.ts` will automatically be picked up).

Read the awesome [official Scriptable Documentation](https://docs.scriptable.app).

## Serving the widget

Serve your widget by running `yarn dev` in `./scriptable-api`.

Your compiled widget should now be available on `YOUR_LOCAL_DNS_NAME:3000/compiled-widgets/widget-modules/camelCasedName.js`.

The demo page is also available on `YOUR_LOCAL_DNS_NAME:3000` (without your widget, that requires some additional steps).

## Loading the widget on your device for the first time

Paste a compiled `WidgetLoader` (can be found in `./scriptable-api/public/compiled-widgets/widgetLoader.js`, or on the demo site) into Scriptable with the following `argsConfig` and press play.
```js
const argsConfig = {
    fileName: "camelCasedNameEndingOnWidgetModule",
    rootUrl: "http://macbook-pro.local:3000/compiled-widgets/widget-modules/",
    defaultWidgetParameter: "",
    downloadQueryString: "",
};
```

Note that the `widgetParameter` is the default parameter to be sent into `createWidget`, this parameter can be overruled by filling it into the setting of a widget.

## Iterating the widget

With `yarn watch` running in `./widgets` and `yarn dev` running in `./scriptable-api` you'll now always run the latest code on your device:

- `yarn watch` compiles the .ts into a public .js widget
- `yarn dev` will serve this new version of the widget with a new ETag
- the `WidgetLoader` wil notice to ETag change on run and pull in the new version of the code

# Deployment

Deployment to Vercel is easiest for the Nextjs app:

- Clone this project
- Link Github to Vercel and make the new project available to Vercel
- During setup pick the subdirectory `scriptable-api`
- Done!

## Updating widgets

If people installed widgets with the `WidgetLoader` pointing to your deployed instance, simply pushing code to the `main` branch would already let them have the updated code again on next refresh of their device.


# Credits

- The [Scriptable App](https://scriptable.app/) of course
- The idea of bootstrapping widgets: https://gitlab.com/sillium-scriptable-projects/universal-scriptable-widget
- The Sticky example https://github.com/drewkerr/scriptable/blob/main/Sticky%20widget.js
- The Covid19 example: https://gist.github.com/planecore/e7b4c1e5db2dd28b1a023860e831355e