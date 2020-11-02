import { Container, Link, makeStyles, Paper, TextField, Typography } from "@material-ui/core"
import { readFileSync } from "fs"
import { GetStaticProps } from "next"
import Head from 'next/head'
import { resolve } from "path"
import { useEffect, useMemo, useState } from "react"
import { useDebounce } from 'use-debounce'
import { CodeWithClipboard } from "../src/components/CodeWithClipboard"
import { WidgetModuleCard } from "../src/components/WidgetModuleCard"
import { WidgetModule } from "../src/interfaces"




interface PageProps {
  widgetLoader: string,
  widgetModules: WidgetModule[]
}



const useStyles = makeStyles(theme => ({
  header: {
    background: theme.palette.primary.main,
    color: "white",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  alert: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  cardsContainer: {
    display: "flex",
    overflow: "auto",
    flexWrap: "nowrap",
    alignItems: "center",
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(-1),
  },
  paperComingSoon: {
    height: 154,
    minWidth: 280,
    textAlign: "center"
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
    width: "100%",
    maxWidth: 420
  },
  developmentSection: {
    background: theme.palette.action.hover,
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  }
}))


const setWidgetModule = (widgetLoader: string, rootUrl: string, widgetModule?: WidgetModule, widgetParameter?: string) => {
  if (!widgetModule) {
    return widgetLoader;
  }
  let filled = widgetLoader;
  const { fileName, meta } = widgetModule;
  const args = { fileName, ...meta.loaderArgs, rootUrl: rootUrl, widgetParameter: widgetParameter };

  for (let arg of Object.keys(args)) {
    const reg = new RegExp(`__${arg}__`, "gim")
    filled = filled.replace(reg, args[arg])
  }
  return filled;
}

export default function Page({ widgetLoader, widgetModules }: PageProps) {
  const [rootUrl, setRootUrl] = useState<string>("");
  const [widgetParameterValue, setWidgetParameterValue] = useState<string>("");
  const [widgetParameter] = useDebounce(widgetParameterValue, 300);
  const [selectedModule, setSelectedModule] = useState<WidgetModule | undefined>(widgetModules[0]);
  const classes = useStyles()

  const widgetLoaderWithModule = useMemo(() => setWidgetModule(
    widgetLoader,
    rootUrl,
    selectedModule,
    widgetParameter
  ), [widgetLoader, selectedModule, rootUrl, widgetParameter])

  useEffect(() => {
    setRootUrl((_) => `${window.location.origin}/compiled-widgets/widget-modules/`)
  }, [])

  return (
    <div>
      <Head>
        <title>Scriptable API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={classes.header}>
        <Container maxWidth="md">
          <Typography component="h3" variant="h3" color="inherit">Scriptable TS Boilerplate</Typography>
          <Typography variant="h5" style={{ opacity: 0.6 }} gutterBottom >
            Makes creating iOS widgets with the <a style={{ color: "inherit" }} href="https://scriptable.app">Scriptable App</a> even more fun!
          </Typography>

          <Typography style={{ paddingTop: 16 }} variant="body1" gutterBottom component="div" >
            <li style={{ listStyle: "none" }}>🔥 Hot-loading widgets served by Next.js</li>
            <li style={{ listStyle: "none" }}>🔨 The safety of TypeScript</li>
            <li style={{ listStyle: "none" }}>🍭 Build, compile, rollup and other configs</li>
            <li style={{ listStyle: "none" }}>🚀 Deploy to Vercel with ease</li>
            <li style={{ listStyle: "none" }}>✨ Roll out updates to live widgets automatically</li>
          </Typography>
        </Container>
      </div>


      <Container maxWidth="md">
        <Typography component="h4" variant="h4" gutterBottom>Try the included examples</Typography>

        <Typography component="h5" variant="h5" gutterBottom>1. Pick an example widget</Typography>
        <Typography variant="body1" gutterBottom color="textSecondary"  >
          These widget examples are included in the boilerplate.
        </Typography>
        <div className={classes.cardsContainer}>
          {widgetModules.map(wm =>
            <WidgetModuleCard
              widgetModule={wm}
              key={wm.fileName}
              onSelect={() => setSelectedModule(wm)}
              isSelected={wm.fileName === selectedModule?.fileName} />
          )}
          <Paper className={classes.paperComingSoon} >
            <Typography variant="caption" color="textSecondary" component="div" style={{ marginTop: 68 }}>
              More examples coming soon!
          </Typography>
          </Paper>
        </div>

        <Typography component="h5" variant="h5" gutterBottom>2. Provide its default input</Typography>
        <Typography variant="body1" gutterBottom color="textSecondary"  >
          This is not required and can also be filled into the Widget Setting after adding the widget
        </Typography>
        <TextField
          className={classes.textField}
          value={widgetParameterValue}
          variant="outlined"
          color="primary"
          label={selectedModule ? selectedModule.meta.paramLabel : "First pick a widget.."}
          placeholder={selectedModule ? selectedModule.meta.paramPlaceHolder : "First pick a widget.."}
          InputLabelProps={{
            shrink: true
          }}
          disabled={!selectedModule}
          onChange={(event) => setWidgetParameterValue(event.currentTarget.value)}
        />

        <Typography component="h5" variant="h5" gutterBottom>3. Copy the snippet</Typography>

        {/* The key is just a quick hack to remount the code on every change to make highlight work */}
        <CodeWithClipboard
          key={widgetLoaderWithModule}
          value={selectedModule ? widgetLoaderWithModule : "// First pick a widget.."}
          inActive={!selectedModule}
          collapsedHeight={selectedModule ? 300 : 100}
        />

        <div style={{ margin: 20 }} />
        <Typography component="h5" variant="h5" gutterBottom>4. Paste the snippet</Typography>
        <Typography variant="body1" gutterBottom component="div" >
          Open the Scriptable App, create a new script with the plus button and paste the snippet.
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom component="div" >
          Now it's ready to be added as a widget. Just go in wiggle mode and add it to your homescreen!
        </Typography>

      </Container>
      <div className={classes.developmentSection}>
        <Container maxWidth="md">
          <Typography component="h4" variant="h4" gutterBottom>Try the boilerplate</Typography>
          <Typography variant="body1" gutterBottom component="div" >
            Visit the <Link href="https://github.com/jasperhartong/scriptable-ts-boilerplate">Github repo</Link> or the <Link href="https://docs.scriptable.app">official Scriptable Documentation</Link>. Follow any updates on Twitter <Link href="https://twitter.com/jasperhartong">@jasperhartong</Link>.
          </Typography>
        </Container>

      </div>
    </div>
  )
}


export const getStaticProps: GetStaticProps<{}, {}> = async ({ params }) => {
  const widgetLoaderPath = resolve('./public/compiled-widgets/widget-loader.js');
  const widgetModuleFilenames = ["sticky-widget-module"]
  const props: PageProps = {
    widgetLoader: readFileSync(widgetLoaderPath).toString("utf-8"),
    widgetModules: widgetModuleFilenames.map(fileName => {
      const rawScript = readFileSync(resolve(`./public/compiled-widgets/widget-modules/${fileName}.js`)).toString("utf-8");
      const meta = JSON.parse(readFileSync(resolve(`./public/compiled-widgets/widget-modules/${fileName}.meta.json`)).toString("utf-8")) as WidgetModule["meta"];
      return ({
        rawScript,
        fileName,
        imageSrc: `/compiled-widgets/widget-modules/${fileName}.png`,
        meta
      })
    })
  }


  return { props }
}