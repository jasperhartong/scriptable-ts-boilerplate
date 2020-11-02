import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import 'highlight.js/styles/monokai-sublime.css';

const theme = createMuiTheme({
  palette: {
    type: "light",
  },
  shape: {
    borderRadius: 16,
  },
})

function MyApp({ Component, pageProps }) {
  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <Component {...pageProps} />
  </ThemeProvider>
}

export default MyApp
