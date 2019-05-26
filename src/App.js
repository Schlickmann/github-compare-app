import React, { Component, Fragment } from 'react';
import GlobalStyle from './styles/global';

import Main from './pages/Main';

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  render() {
    return (
      <Fragment>
        <GlobalStyle />
        <Main />
      </Fragment>
    );
  }
}

export default App;
