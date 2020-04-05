import React, {Component} from 'react';
import ls from 'local-storage'
import {
    Redirect
} from "react-router-dom";
import {compute_result} from "./Results";
import {GoBackButton} from "./HundredEmployees";

let usd = new Intl.NumberFormat("en-US",
    { style: "currency", currency: "USD",
        minimumFractionDigits: 2 });

class LeftPaneEmpHealth extends Component {

    render(){
        return(
            <div style={{paddingTop: "4em", paddingLeft: "2em", paddingRight: "2em"}}>
                <p style={{margin: "0"}}>Your Loan Amt:</p>
                <h3 style={{color: "green"}}>{`${usd.format(this.props.result)}`}</h3>
                <br/>
                <div style={{borderTop: "2px black solid"}}>
                    <br/>
                    <p>
                        For each month, calculate how much you (the employer) paid for employee's health insurance,
                        and enter the information into the appropriate box.
                    </p>
                </div>
            </div>
        );
    }

}

class RightPaneEmpHealth extends Component {

    constructor(props){
        super(props);
        this.state = {
            to_next: false
        };
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December"];
    }

    handleInputChange(event) {
        const target = event.target;

        this.setState({
            [target.name]: target.value,
        });

        ls.set([target.name], target.value);
        ls.set("result", compute_result(0)['final']);
        this.props.update(compute_result(0)['final']);
    }

    onSubmit(event){
        this.setState({
                to_next: true
            }
        );
        event.preventDefault();
    }

    render(){
        if(!this.state.to_next) {
            return (
                <div className='row' style={{padding: "3.5em"}}>
                    <form id="hundreds" style={{display: "grid"}} onSubmit={this.onSubmit.bind(this)}>
                        {this.months.map((month) =>
                            <div>
                                <label style={{display: "flex"}}><h2>{`${month}`}</h2></label>
                                <table>
                                    <tr>
                                        <td><h3>Health Insurance</h3></td>
                                        <td><h3>Retirement Benefits</h3></td>
                                        <td><h3>HSA Contributions</h3></td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingRight: "2em"}}>
                                            <input type="text" name={`employer_health_${month}`}
                                                   defaultValue={ls.get(`employer_health_${month}`) || 0}
                                                   onChange={this.handleInputChange.bind(this)}/>
                                        </td>
                                        <td style={{paddingRight: "2em"}}>
                                            <input type="text" name={`employer_retirement_${month}`}
                                                   defaultValue={ls.get(`employer_retirement_${month}`) || 0}
                                                   onChange={this.handleInputChange.bind(this)}/>
                                        </td>
                                        <td style={{paddingRight: "2em"}}>
                                            <input type="text" name={`employer_hsa_${month}`}
                                                   defaultValue={ls.get(`employer_hsa_${month}`) || 0}
                                                   onChange={this.handleInputChange.bind(this)}/>
                                        </td>
                                    </tr>
                                </table>
                                <br/>
                            </div>
                        )}
                    </form>
                </div>
            );
        }
        else{
            return(
                <Redirect to="/results"/>
            )
        }
    }

}

class EmployerHealth extends Component {

    render(){

        return(

            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-4 left_col' style={{overflowY: "scroll", height: "85vh"}}>
                        <LeftPaneEmpHealth result={this.props.result}/>
                    </div>
                    <div className='col-8 right_col' style={{overflowY: "scroll", height: "85vh"}}>
                        <RightPaneEmpHealth num_over={this.props.num_over} update={this.props.update}/>
                    </div>
                </div>
                <br/>
                <div className='row' style={{display: "inline-block", paddingBottom: "1em"}}>
                    <GoBackButton path={parseInt(ls.get("num_over_hundred")) > 0 ? "/hundreds" : "/"}/>
                    <button form="hundreds" className='next_button'>
                        Next
                    </button>
                </div>
            </div>

        );
    }

}

export default EmployerHealth;