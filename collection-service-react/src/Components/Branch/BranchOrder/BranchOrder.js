import React from "react";
import './order.css';
import Button from '../BranchButton/BranchButton';


// BOOTSTRAP IMPORTS
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';


export default class BranchOrder extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            ...props,
            
        }

    }
    static getDerivedStateFromProps(props, state) {
        return { ...props };
    }

    elapsedTime = () => {
        const since = (new Date().getMinutes - 10), // Saturday, 08-Apr-17 21:00:00 UTC
            elapsed = (new Date().getTime() - since) / 1000;

        if (elapsed >= 0) {
            const diff = {};

            diff.minutes = Math.floor(elapsed / 60 % 60);
            diff.seconds = Math.floor(elapsed % 60);

            let message = `${diff.minutes}:${diff.seconds}`;
            message = message.replace(/(?:0. )+/, '');
            alert(message);
        }
        else {
            alert('Elapsed time lesser than 0, i.e. specified datetime is still in the future.');
        }
    }

    render() {
        var { updateHandler, deleteHandler} = this.props
        return (
            <Container className={'branch-order noselect ' + (this.state.orderData.isOrderReady ? 'bg-success' : 'bg-light')}>
                <p className='digit'>{this.state.orderData.orderDigit}</p>
                <p className={'name '+(this.state.orderData.isOrderReady ? 'text-white' : 'text-dark')}>{this.state.orderData.orderCustomerName}</p>
                <p className='timer'>{}</p>
                <Row>
                    {this.state.orderData.isOrderReady ? null : <Col style={{ padding: 0 }}><Button color='bg-success' click={() => updateHandler(this.state.orderData._id)}><i className="fas fa-check icon"></i></Button></Col>}
                    <Col style={{ padding: 0 }}><Button color={this.state.orderData.isOrderReady ? 'bg-dark' : 'bg-danger'} click={() => deleteHandler(this.state.orderData._id)}><i className=" fas fa-trash icon"></i></Button></Col>
                </Row>
            </Container>
        )
    }
}