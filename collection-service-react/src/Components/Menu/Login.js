import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            endpoint: 'http://localhost:8000'
        }
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.handleBranchOption = this.handleBranchOption.bind(this);
        this.handleShopWindowOption = this.handleShopWindowOption.bind(this);
    }

    // static getDerivedStateFromProps(props, state) {
    //     return { ...props };
    // }


    emailChangeHandler = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    passwordChangeHandler = (event) => {
        this.setState({
            password: event.target.value
        })
    }
    handleBranchOption = () => {
        this.setState({
            selectedOption: 'branch'
        });
    };
    handleShopWindowOption = () => {
        this.setState({
            selectedOption: 'shopwindow'
        });
    };

    


    submitHandler = () => {
        fetch(this.state.endpoint + '/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),

        }).then(res => res.json()).then(resData => {
            console.log(resData.branch._id);
            if (this.state.selectedOption === 'branch') {
                this.props.history.push("/branch/" + resData.branch._id);
            } else if (this.state.selectedOption === 'shopwindow') {
                this.props.history.push("/id/" + resData.branch._id);
            } else {
                console.log('Login failed');
            }

        }).catch(err => console.log(err));

    }




    render() {
        return (
            <Container style={{ maxWidth: '25rem', marginTop: '10rem' }}>
                <Row style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', paddingBottom: '2rem'
                }}>
                    <img src='./powerprint-logo.png' alt='powerprint logo'></img>
                </Row>
                <Row>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Email pobočky"
                            aria-label="Email pobočky"
                            aria-describedby="basic-addon2"
                            onChange={this.emailChangeHandler}
                        />
                        <InputGroup.Append>
                            <InputGroup.Text id="basic-addon2">@powerprint.cz</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </Row>
                <Row>
                    <InputGroup className="mb-3">
                        <FormControl
                            type='password'
                            placeholder="Heslo"
                            aria-label="Heslo"
                            aria-describedby="basic-addon2"
                            onChange={this.passwordChangeHandler}
                        />
                    </InputGroup>
                </Row>
                <Row style={{ marginBottom: '2rem' }}>
                    {/* <Form>
                        <Form.Check
                            type="radio"
                            label="Přejít do systému"
                            name="nextstep"
                            id="branch"
                            required
                            defaultChecked
                            onClick={this.handleOptionChange}
                            
                        />
                        <Form.Check
                            type="radio"
                            label="Přejít na výdejní obrazovku"
                            name="nextstep"
                            id="shopwindow"
                            required
                            onClick={this.handleOptionChange}
                            
                        />
                    </Form> */}
                    <Form>
                        <Form.Check
                            type="radio"
                            label="Přejít do systému"
                            name="nextstep"
                            id="branch"
                            onChange={this.handleBranchOption}
                        />
                        <Form.Check
                            type="radio"
                            label="Zobrazit výdejní obrazovku"
                            name="nextstep"
                            id="shopwindow"
                            onChange={this.handleShopWindowOption}
                        />
                    </Form>
                </Row>
                <Row>
                    <Button variant="primary" style={{ width: '100%' }} onClick={this.submitHandler} >Přihlásit se </Button>
                </Row>
            </Container>
        )
    }
}
