import { readFileSync } from "fs"
import { GetStaticProps } from "next"
import Head from 'next/head'
import { resolve } from "path"
import { useEffect, useState } from "react"
import styles from '../styles/Home.module.css'


interface PageProps {
  scriptLoader: string
}

interface ScriptLoaderTemplateArgs {
  rootUrl: string;
  name: string;
  iconColor: string;
  iconGlyph: string;
}

const defaultArgs: ScriptLoaderTemplateArgs = {
  rootUrl: "http://macbook-pro.local/3000/compiled-widgets/widget-modules",
  name: "emittime-script-own-modules",
  iconColor: "green",
  iconGlyph: "download"
}

const fillTemplate = (script: string, args: Partial<ScriptLoaderTemplateArgs>) => {
  const combinedArgs: ScriptLoaderTemplateArgs = { ...defaultArgs, ...args };
  let filled = script;
  for (let arg of Object.keys(combinedArgs)) {
    const reg = new RegExp(`__${arg}__`, "gim")
    filled = filled.replace(reg, combinedArgs[arg])
  }
  return filled;
}

export default function Page(props: PageProps) {
  const [args, setArgs] = useState<Partial<ScriptLoaderTemplateArgs>>({})
  useEffect(() => {
    setArgs({
      rootUrl: window.location.origin
    })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Scriptable API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <textarea
          value={fillTemplate(props.scriptLoader, args)}
          style={{ width: 600, height: 800 }} />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}


export const getStaticProps: GetStaticProps<{}, {}> = async ({ params }) => {
  const scriptLoaderPath = resolve('./public/compiled-widgets/widget-loader.js');
  const props: PageProps = {
    scriptLoader: readFileSync(scriptLoaderPath).toString("utf-8")
  }


  return { props }
}