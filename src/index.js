import React,  { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom"

// Imports for state management - redux
import { createStore, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import rootReducer from "./reducers/index";
import { setUser, clearUser } from "./actions/index"

// Firebase related imports
import firebase from "./firebase"

// Import components 
import Spinner from "./Spinner"
import App from './components/App';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// import semantic ui styles
import "semantic-ui-css/semantic.min.css"

const middlewares = [];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(...middlewares)
))

class Root extends Component{

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.props.setUser(user)
        this.props.history.push("/");
      }else{
        this.props.history.push("/login");
        this.props.clearUser()
      }
    })
  }

  render() {
    return this.props.isLoading ? <Spinner/> : (
      
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      
    )
  }

}

const mapStateToProps = (state) => {
  return {
    isLoading: state.user.isLoading
  }
}
const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>
 
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
