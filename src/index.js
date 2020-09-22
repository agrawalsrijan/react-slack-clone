import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

const Root = () => {
  return(
    <Router>
      <Switch>
        <Route path="/" component={App}/>
      </Switch>
    </Router>
  )
}

ReactDOM.render(
  
  <Root/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
