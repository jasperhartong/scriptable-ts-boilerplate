# Work in Progress

- [ ] Add more scripts
- [ ] Add better explanation
- [ ] Test updating
- [ ] Clean up bootstrapping code


# Local development
* ./scriptable-api: yarn dev
* Visit {your locally available address}:3000. e.g. http://macbook-pro.local:3000
* ./widgets: yarn watch

Install a WidgetLoader with argsConfig similar to:
```
const argsConfig = {
        fileName: "simple-sticky-widget-module",
        rootUrl: "http://macbook-pro.local:3000/compiled-widgets/widget-modules/",
        widgetParameter: ""
    };
```

Now when coding the following will happen:
- The Typescript files are compiled to the nextjs public folder as js
- When running the WidgetLoader will download any new changes (also see log in app)