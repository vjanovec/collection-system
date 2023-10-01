import React from 'react';
import './input.css';
import Button from '../BranchButton/BranchButton';

// BOOTSTRAP IMPORTS
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert'

export default class BranchForm extends React.Component {

    constructor(props) {
        super();
        this.state = {
            ...props,
            orderDigit: 1,
        };

        this.numberChangeHandler = this.numberChangeHandler.bind(this);
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.autogenerateHandler = this.autogenerateHandler.bind(this);

    }
    static getDerivedStateFromProps(props, state) {
        return { ...props };
    }


    numberChangeHandler = (event) => {
        const digit = parseInt(event.target.value);
        this.setState({
            orderDigit: digit
        })
    }

    nameChangeHandler = (event) => {
        this.setState({
            orderCustomerName: event.target.value
        })
    }
    autogenerateHandler = () => {
        console.log(this.state.branchId);
        fetch(this.state.endpoint + '/last-order/'+this.state.branchId)
            .then(response => response.json())
            .then(resData => {
                this.setState({ orderDigit: resData.lastOrderDigit + 1 });
            });
    }


    render() {
        var { addHandler, updateHandler, deleteHandler } = this.props;
        return (
            <div className='bg-light branch-form noselect'>
                <p className='label'>Zadejte pořadové číslo</p>
                <input id='number-input' type='number' className='number-input' value={this.state.orderDigit} onChange={this.numberChangeHandler} autoFocus></input>
                <button className='autogen-btn bg-primary' onClick={this.autogenerateHandler}>AUTO GENERATE</button>
                <p className='label'>Zadejte jméno, číslo objednávky nebo identifikační klíč</p>
                <input id='number-input' type='text' className='name-input' onChange={this.nameChangeHandler}></input>
                {this.state.alert ? <Alert variant={this.state.alert.isAlertPositive ? 'success' : 'danger'}>{this.state.alert.alertContent}</Alert> : null}

                <Row>
                    <Col style={{ padding: 0 }}><Button color='bg-primary' click={() => addHandler(this.state.orderDigit, this.state.orderCustomerName, false)} ><i className="fas fa-plus icon"></i></Button></Col>
                    <Col style={{ padding: 0 }}><Button color='bg-success' click={() => updateHandler(this.state.orderDigit)} ><i className="fas fa-check icon"></i></Button></Col>
                    <Col style={{ padding: 0 }}><Button color='bg-danger' click={() => deleteHandler(this.state.orderDigit)} ><i className="fas fa-trash icon"></i></Button></Col>
                </Row>
            </div>
        )
    }
}