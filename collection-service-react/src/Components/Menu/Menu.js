import React from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './menu.css';


export default class Menu extends React.Component {
    constructor(props) {
        super();
        this.state = {
            ...props,
        }
    }


    render() {
        return (
            <Container>
                <Row>
                    <h2>{this.state.branchName}</h2>
                </Row>
                <Row className='menu'>
                    <Col className='menu-option branch-option bg-primary '>
                    <p className='option-caption text-dark'>Obsluha systému</p>
                        <Button className='bg-light text-dark'>Přejít do systému</Button>
                    
                    </Col>
                    <Col className='menu-option branch-option bg-light'>
                    <p className='option-caption text-dark'>Výdejní monitor</p>
                        <Button className='bg-primary'>Přejít do systému</Button>
                    
                    </Col>
                </Row>
            </Container>
        )
    }

}