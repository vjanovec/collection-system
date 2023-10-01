import React from "react";
import './order.css';

// BOOTSTRAP IMPORTS
import Container from 'react-bootstrap/Container';

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

    render() {
        return (
            <Container className={'branch-order noselect ' + (this.state.orderData.isOrderReady ? 'bg-success' : 'bg-light')}>
                <p class='digit'>{this.state.orderData.orderDigit}</p>
            </Container>
        )
    }
}