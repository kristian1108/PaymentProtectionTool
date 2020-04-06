import React, {Component} from 'react';
import ModalImage from "react-modal-image";
import {
    Redirect,
    useHistory
} from "react-router-dom";
import ls from 'local-storage'
import {compute_result} from "./Results";


const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
const form_941 = '/static/img/form_941.png';

let usd = new Intl.NumberFormat("en-US",
    { style: "currency", currency: "USD",
        minimumFractionDigits: 2 });


function HowMany(props){

    if (props.hundredk === "yes"){
        return(
          <div style={{display: 'flex'}}>
              <label className="hund_labels">How many?
                  <input type='text' name='num_over_hundred'
                         onChange={props.onChange} style={{marginLeft: "1em"}}
                         defaultValue={ls.get("num_over_hundred") || 0}
                  />
              </label>
          </div>
        );
    }
    else{
        return(
            <div/>
        );
    }
}


class LeftPaneNineFour extends Component {

    render(){
        return(
            <div style={{paddingTop: "4em", paddingLeft: "2em", paddingRight: "2em"}}>
                <p style={{margin: "0"}}>Your Loan Amt:</p>
                <h3 style={{color: "green"}}>{`${usd.format(this.props.result)}`}</h3>
                <br/>
                <div style={{borderTop: "2px black solid"}}>
                    <br/>
                    <p>
                        Let's start with some information from your
                        <a href="https://www.irs.gov/pub/irs-pdf/f941.pdf"> Quarterly 941 Tax Forms</a>.
                    </p>
                    <ModalImage
                        small={form_941}
                        large={form_941}
                        alt="Form 941 Explanation"
                    />
                    <br/>
                    <p>(Click Image To Enlarge)</p>
                </div>
            </div>
        );
    }

}

class RightPaneNineFour extends Component {

    constructor(props){
        super(props);
        this.state = {
            to_next: false,
            num_over_hundred: ls.get('num_over_hundred') || 0
        };
    }

    handleInputChange(event) {
        const target = event.target;

        this.setState({
            [target.name]: target.value,
        });

        ls.set([target.name], target.value);

        if (target.name === "hundredk" && target.value === "no"){
            this.setState(
                {num_over_hundred: 0}
            );
            ls.set("num_over_hundred", 0);
        }

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
        if(!this.state.to_next){
            return(
                <div className='row' style={{padding: "3.5em"}}>
                    <form id="nine_four" style={{display: "grid"}} onSubmit={this.onSubmit.bind(this)}>
                        <div>
                            <h2 style={{display: "flex"}}>Employee Salaries</h2>
                            <br/>
                            <label style={{display: "flex"}}>
                                <h3>Do you have any employees who make over $100k/year?</h3>
                                <label htmlFor="yes" style={{marginLeft: "1em"}} className='hund_labels'>Yes
                                    <input type="radio" onChange={this.handleInputChange.bind(this)}
                                           id="yes" value="yes" name="hundredk"
                                           style={{marginLeft: "1em", marginRight: "1em"}}/>
                                </label>
                                <br/>
                                <label htmlFor="no" className='hund_labels'>No
                                    <input type="radio" onChange={this.handleInputChange.bind(this)}
                                           id="no" name="hundredk" value="no" style={{marginLeft: "1em"}}/>
                                </label>
                            </label>
                        </div>
                        <HowMany hundredk={this.state.hundredk} onChange={this.handleInputChange.bind(this)}/>
                        <br/>
                        {quarters.map((quarter) =>
                            <div>
                                <label style={{display: "flex"}}><h2>{quarter}</h2></label>
                                <table>
                                    <tr>
                                        <td><h3>Box 5C Column 1</h3></td>
                                        <td><h3>Box 3</h3></td>
                                        <td><h3>Box 5e</h3></td>
                                        <td><h3>SUTA Taxes</h3></td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingRight: "2em"}}>
                                            <input type="text" name={`${quarter}_box5c`}
                                                   defaultValue={ls.get(`${quarter}_box5c`) || 0}
                                                   onChange={this.handleInputChange.bind(this)}/>
                                        </td>
                                        <td style={{paddingRight: "2em"}}>
                                            <input type="text" name={`${quarter}_box3`}
                                                   defaultValue={ls.get(`${quarter}_box3`) || 0}
                                                   onChange={this.handleInputChange.bind(this)}/>
                                        </td>
                                        <td style={{paddingRight: "2em"}}>
                                            <input type="text" name={`${quarter}_box5e`}
                                                   defaultValue={ls.get(`${quarter}_box5e`) || 0}
                                                   onChange={this.handleInputChange.bind(this)}/>
                                        </td>
                                        <td>
                                            <input type="text" name={`${quarter}_suta`}
                                                   defaultValue={ls.get(`${quarter}_suta`) || 0}
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
            if (this.state.num_over_hundred > 0){
                return(
                    <Redirect to="/hundreds"/>
                );
            }
            else{
                return(
                    <Redirect to="/health"/>
                );
            }
        }

    }
}


class NineFour extends Component {

    render(){
        return(
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-4 left_col' style={{overflowY: "scroll", height: "85vh"}}>
                        <LeftPaneNineFour result={this.props.result}/>
                    </div>
                    <div className='col-8 right_col' style={{overflowY: "scroll", height: "85vh"}}>
                        <RightPaneNineFour update={this.props.update}/>
                    </div>
                </div>
                <br/>
                <div className='row' style={{display: "inline-block", paddingBottom: "1em"}}>
                    <button form="nine_four" className='next_button'>
                        Next
                    </button>
                </div>
            </div>
        );
    }

}

export default NineFour;