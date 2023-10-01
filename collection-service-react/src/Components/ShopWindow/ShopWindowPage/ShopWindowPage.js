import React from 'react';
import socketIOClient from "socket.io-client";
import CustomerOrder from '../../Customers/CustomerOrder/CustomerOrder';

import '../../Branch/BranchPage/branchPage.css';
// BOOTSTRAP IMPORTS
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';



export default class ShopWindowPage extends React.Component {
    constructor(props) {
        super();
        this.state = {
            ...props,
            orders: [],
            endpoint: "http://localhost:8000",
            alert: null
        };


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

render() {
    let orders = null;
    if(this.state.orders.length > 0) {
        orders = this.state.orders.map(order => {
            return <Col sm={6} md={4} lg={2}><CustomerOrder orderData={order}></CustomerOrder></Col>
        })
    }

    return (
        <div className='wrapper'>
            <h2 className='branch-name text-dark'>Výdej objednávek Diplomka24 {this.state.branchName ? '- pobočka '+this.state.branchName : ''}</h2>
            <Container className='container-order'>
                <Row className='row-order'>
                    {orders}
                </Row>
            </Container>
        </div>
    )
}
}
