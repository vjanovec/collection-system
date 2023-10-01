import React from 'react';
import socketIOClient from "socket.io-client";

import BranchOrder from '../BranchOrder/BranchOrder';
import BranchForm from '../BranchForm/BranchForm';

import './branchPage.css';
// BOOTSTRAP IMPORTS
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';



export default class BranchPage extends React.Component {
    constructor(props) {
        super();
        this.state = {
            branchId: props.branchId,
            orders: [],
            endpoint: "http://localhost:8000",
            alert: null
        };
        this.updateHandler.bind(this);
        this.deleteHandler.bind(this);
        this.addHandler.bind(this);
        console.log(this.state.branchId);
        fetch('http://localhost:8000/branch-id/'+this.state.branchId).then(response => response.json()).then(resData => {
            if(resData) {
              this.setState({
                  branchName: resData.branch.name
              })
            } else {
              return
            }
            
          }).catch(err => {
            console.log(err);
          });
    }

    componentDidMount() {
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        this.setState({
            socket: socket,
        })
        socket.on(this.state.branchId+'/orders', data => {
            console.log(data);
            this.setState({orders: data});
        });
    }

    updateHandler = (id) => {
        fetch(this.state.endpoint + '/update-order/' + id, {
            method: 'PUT',
        }).then(res => res.json()).then(resData => this.setState({alert: {alertContent: resData.response.content, isAlertPositive: resData.response.isPositive}})).catch(err => console.log(err));
    }

    deleteHandler = (id) => {
        fetch(this.state.endpoint + '/delete-order/' + id, {
            method: 'DELETE',
        }).then(res => res.json()).then(resData => this.setState({alert: {alertContent: resData.response.content, isAlertPositive: resData.response.isPositive}})).catch(err => console.log(err));
    }

    addHandler = (digit, name, isReady) => {
        if (digit) {
            fetch(this.state.endpoint + '/add-order/', {
                method: 'POST',
                body: JSON.stringify({
                    branchId: this.state.branchId,
                    orderDigit: digit,
                    orderCustomerName: name,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }

            }).then(res => res.json()).then(resData => this.setState({ alert: { alertContent: resData.response.content, isAlertPositive: resData.response.isPositive }})).catch(err => console.log(err));
        }
    }






render() {


    let orders = null;
    if(this.state.orders) {
        orders = this.state.orders.map(order => {
            return <Col sm={6} md={3} lg={3}><BranchOrder orderData={order} updateHandler={this.updateHandler} deleteHandler={this.deleteHandler}></BranchOrder></Col>
        })
    }

    return (
        <div className='wrapper'>
                        <h2 className='branch-name text-dark'>správa systému Diplomka24 {this.state.branchName ? '- pobočka '+this.state.branchName : ''}</h2>
            <BranchForm endpoint={this.state.endpoint} addHandler={this.addHandler} updateHandler={this.updateHandler} deleteHandler={this.deleteHandler} alert={this.state.alert} branchId={this.state.branchId}></BranchForm>
            <Container className='container-order'>
                <Row className='row-order'>
                    {orders}
                </Row>
            </Container>
        </div>
    )
}
}
