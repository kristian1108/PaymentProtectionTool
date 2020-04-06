import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import "../../static/scss/main.scss";
import NineFour from "./NineFour";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {HundredEmployees} from "./HundredEmployees";
import EmployerHealth from "./EmployerHealth";
import {Results, compute_result} from "./Results";

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      result: compute_result(0)['final']
    };
  }

  update_result(res){
    this.setState({
      result: res,
    });
  }

  render(){
    return(
        <Router>
          <Switch>
            <Route path="/" exact={true}>
              <NineFour update={this.update_result.bind(this)} result={this.state.result}/>
            </Route>
            <Route path="/health" exact={true}>
              <EmployerHealth update={this.update_result.bind(this)} result={this.state.result}/>
            </Route>
            <Route path="/hundreds" exact={true}>
              <HundredEmployees update={this.update_result.bind(this)} result={this.state.result}/>
            </Route>
            <Route path="/results" exact={true}>
              <Results/>
            </Route>
          </Switch>
        </Router>
    );
  }

}

const wrapper = document.getElementById("app");
ReactDOM.render(<App />, wrapper);
