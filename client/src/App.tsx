import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import HomePage from './pages/HomePage';
import { red } from '@material-ui/core/colors';
import 'typeface-roboto'
import './App.css'
import { ApolloProvider } from 'react-apollo';
import client from './apollo/client';
import { BrowserRouter } from 'react-router-dom';

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
      <ApolloProvider client={client as any}>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <HomePage />
          </BrowserRouter>
        </MuiThemeProvider>
      </ApolloProvider>
    )
  }
}

export default App;
