import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import HomePage from './pages/HomePage';
import { red } from '@material-ui/core/colors';
import 'typeface-roboto'
import './App.css'

const theme = createMuiTheme({
  spacing: { unit: 4 },
  palette: {
    primary: red,
    secondary: red
  }
})

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <HomePage />
      </MuiThemeProvider>
    )
  }
}

export default App;
