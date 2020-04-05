
import React, {Component} from 'react';
import ls from 'local-storage'
import {
    Redirect,
    useHistory
} from "react-router-dom";
import {compute_result} from "./Results";


let usd = new Intl.NumberFormat("en-US",
    { style: "currency", currency: "USD",
        minimumFractionDigits: 2 });


function GoBackButton(props) {
    const history = useHistory();

    function handleClick() {
        history.push(props.path);
    }

    return (
        <button type="button" onClick={handleClick} className="next_button">
            Back
        </button>
    );
}

class LeftPaneHundreds extends Component {

    render(){
        return(
            <div style={{paddingTop: "4em", paddingLeft: "2em", paddingRight: "2em"}}>
                <p style={{margin: "0"}}>Your Loan Amt:</p>
                <h3 style={{color: "green"}}>{`${usd.format(this.props.result)}`}</h3>
                <br/>
                <div style={{borderTop: "2px black solid"}}>
                    <br/>
                    <p style={{color: "red"}}>
                        <strong>Fill out the following information about your employees that make over $100k/year.</strong>
                    </p>
                    <br/>
                    <p>
                        Note you may have to scroll in the employee list to fill out the information on all employees.
                    </p>
                </div>
            </div>
        );
    }

}

class RightPaneHundredEmployees extends Component {

    constructor(props){
        super(props);
        const num_over = parseInt(ls.get('num_over_hundred'));
        this.range = [...Array(num_over).keys()];
        console.log(num_over);
        console.log(this.range);
        this.state = {
            to_next: false
        };
        console.log(`Constructing. ${this.state.to_next}`)
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
                        {this.range.map((num) =>
                            <div>
                                <label style={{display: "flex"}}><h2>{`Employee ${num + 1} (Over $100k)`}</h2></label>
                                <table>
                                    <tr>
                                        <td><h3>Name</h3></td>
                                        <td><h3>Medicare Wages</h3></td>
                                        <td><h3>Health Insurance</h3></td>
                                        <td><h3>Retirement Contribution</h3></td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingRight: "2em"}}>
                                            <input type="text" name={`hund_name_${num}`}
                                                   defaultValue={ls.get(`hund_name_${num}`) || "Joe Smith"}
                                                   onChange={this.handleInputChange.bind(this)}/>
                                        </td>
                                        <td style={{paddingRight: "2em"}}>
                                            <input type="text" name={`hund_medicare_${num}`}
                                                   defaultValue={ls.get(`hund_medicare_${num}`) || 0}
                                                   onChange={this.handleInputChange.bind(this)}/>
                                        </td>
                                        <td style={{paddingRight: "2em"}}>
                                            <input type="text" name={`hund_health_${num}`}
                                                   defaultValue={ls.get(`hund_health_${num}`) || 0}
                                                   onChange={this.handleInputChange.bind(this)}/>
                                        </td>
                                        <td style={{paddingRight: "2em"}}>
                                            <input type="text" name={`hund_retire_${num}`}
                                                   defaultValue={ls.get(`hund_retire_${num}`) || 0}
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
                <Redirect to="/health"/>
            );
        }
    }

}

class HundredEmployees extends Component {

    render(){

        return(
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-4 left_col' style={{overflowY: "scroll", height: "85vh"}}>
                        <LeftPaneHundreds result={this.props.result}/>
                    </div>
                    <div className='col-8 right_col' style={{overflowY: "scroll", height: "85vh"}}>
                        <RightPaneHundredEmployees update={this.props.update}/>
                    </div>
                </div>
                <br/>
                <div className='row' style={{display: "inline-block", paddingBottom: "1em"}}>
                    <GoBackButton path="/"/>
                    <button form="hundreds" className='next_button'>
                        Next
                    </button>
                </div>
            </div>

        );
    }

}

export {HundredEmployees, GoBackButton};