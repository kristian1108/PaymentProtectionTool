import React, {Component} from 'react';
import ls from 'local-storage'
import {useHistory} from 'react-router-dom';

function sum(arr){
    return arr.reduce((a,b) => a+b, 0);
}

function HomeButton(props) {
    const history = useHistory();

    function handleClick() {
        history.push(props.path);
    }

    return (
        <button type="button" onClick={handleClick} className="home_button">
            Start Again
        </button>
    );
}

let usd = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD",
            minimumFractionDigits: 2 });

function compute_result(tips){

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
        "October", "November", "December"];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const num_over = parseInt(ls.get('num_over_hundred') || 0);
    const range = [...Array(num_over).keys()];

    const boxfiveccol = quarters.map((quarter) => parseInt(ls.get(`${quarter}_box5c`) || 0));
    const boxthree = quarters.map((quarter) => parseInt(ls.get(`${quarter}_box3`) || 0));
    const boxfivee = quarters.map((quarter) => parseInt(ls.get(`${quarter}_box5e`) || 0));
    const suta = quarters.map((quarter) => parseInt(ls.get(`${quarter}_suta`) || 0));
    const hund_medicare = ls.get("hundredk") === "yes" ? range.map((num) => parseInt(ls.get(`hund_medicare_${num}`) || 0)) : [0,0];
    const hund_health = ls.get("hundredk") === "yes" ? range.map((num) => parseInt(ls.get(`hund_health_${num}`) || 0)) : [0,0];
    const hund_retire = ls.get("hundredk") === "yes" ? range.map((num) => parseInt(ls.get(`hund_retire_${num}`) || 0)) : [0,0];
    const employ_health = months.map((month) => parseInt(ls.get(`employer_health_${month}`) || 0));
    const employ_retire = months.map((month) => parseInt(ls.get(`employer_retirement_${month}`) || 0));
    const employ_hsa = months.map((month) => parseInt(ls.get(`employer_hsa_${month}`) || 0));

    let pre_tips_wages = sum(boxfiveccol) + sum(employ_hsa);

    let pre_hunds_wages = pre_tips_wages + (parseInt(tips) || 0);

    let wages_over_hund = sum(hund_medicare);
    let over_hund_adjustment = wages_over_hund - num_over*(100000);

    let gross_wages = pre_hunds_wages - over_hund_adjustment;

    let payroll_costs = gross_wages + sum(employ_health) + sum(employ_retire) + sum(suta);

    let avg_month_payroll = payroll_costs/12.0;

    let return_obj = {
        pre_tips: pre_tips_wages,
        pre_hunds: pre_hunds_wages,
        wages_over_h: wages_over_hund,
        over_hund_adj: over_hund_adjustment,
        gross_wages: gross_wages,
        payroll_costs: payroll_costs,
        avg_m_payroll: avg_month_payroll,
        final: avg_month_payroll*2.5
    };

    return return_obj;

}

class Results extends Component {

    constructor(props){
        super(props);

        this.state = {
            tips: 0,
            result: compute_result(0)
        };

    }

    get_result(){

        return compute_result(this.state.tips)['final'];

    }

    handleInputChange(event) {
        const target = event.target;

        this.setState({
            [target.name]: target.value,
            result: compute_result(target.value)
        });

        ls.set([target.name], target.value);
    }


    render(){
        return (
            <div className='container-fluid right_col' style={{height: "100vh"}}>
                <div>
                    <div className='col-12 my-auto'>
                        <div className='row d-flex justify-content-center' style={{padding: '3em'}}>
                            <form>
                                <label><h3>If tips are applicable, enter them here: </h3></label>
                                <input type="text" name="tips" style={{marginLeft: "1em"}}
                                       defaultValue={ls.get("tips") || 0}
                                       onChange={this.handleInputChange.bind(this)}/>
                            </form>
                        </div>
                        <div className='row d-flex justify-content-center' style={{padding: '1em'}}>
                            <h2>Your loan should be:</h2>
                        </div>
                        <div className='row d-flex justify-content-center'>
                            <h3 style={{color: "green"}} className='result'>{`${usd.format(this.get_result())}`}</h3>
                        </div>
                        <div style={{paddingTop: "6em"}}>
                            <div>
                                <div className='row'>
                                    <div className='col-8 d-flex justify-content-left'>
                                        <h3>
                                            Based on the following information you provided:
                                        </h3>
                                    </div>
                                </div>
                                <br/>
                                <div className='row'>
                                    <div className='col-8 d-flex justify-content-left'>
                                        <table>
                                            <tr>
                                                <td>
                                                    <h3>{`Wages Before Tips: 
                                                    ${usd.format(this.state.result.pre_tips)}`}</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h3>{`Wages Before Adjustment For Employees Over $100k: 
                                                    ${usd.format(this.state.result.pre_hunds)}`}</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h3>{`Total Wages For Employees Over $100k: 
                                                    ${usd.format(this.state.result.wages_over_h)}`}</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h3>{`Adjustment For Employees Over $100k: 
                                                    ${usd.format(this.state.result.over_hund_adj)}`}</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h3>{`Gross Wages: 
                                                    ${usd.format(this.state.result.gross_wages)}`}</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h3>{`Total Payroll Costs: 
                                                    ${usd.format(this.state.result.payroll_costs)}`}</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h3>{`Average Monthly Payroll: 
                                                    ${usd.format(this.state.result.avg_m_payroll)}`}</h3>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div className='col-3 justify-content-center'>
                                        <HomeButton path="/"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export {Results, compute_result};