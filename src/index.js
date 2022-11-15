import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "@mui/material/styles"
import App from "./App"

import { CssBaseline, themes, GlobalTypographyStyles } from "@bcgx-personalization-community/gamma.ui"

const activeTheme = themes.fabriq

ReactDOM.render(
  <>
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <GlobalTypographyStyles />
      <App />
    </ThemeProvider>
  </>,
  document.querySelector("#root")
)