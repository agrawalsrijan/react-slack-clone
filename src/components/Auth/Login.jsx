import React, { Component } from "react"
import { Link } from "react-router-dom"


// Firebase import
import firebase from "../../firebase"

//import semantic-ui-react elements
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react"

class Login extends Component {
    state = {
        email: "",
        password: "",
        errors: [],
        loading: false,
        
    }
    
// Helper function to display errors
    displayErrors = errors => {
        return errors.map((error, i) => <p key={i}>{error.message}</p>)
    }
// handle change in inputs in form
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value, errors: [] })
    }
// submit Login form
    handleSubmit = event => {
        event.preventDefault()
        if (this.isFormValid(this.state)) {
            const { email, password, errors } = this.state
            this.setState({ errors: [], loading: true })
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(signedInUser => {
                    console.log(signedInUser);
                    this.setState({
                        errors: [],
                        loading: false
                    })
                }).catch(err => {
                    console.error(err);
                    this.setState({
                        errors: errors.concat(err),
                        loading: false
                    })
                })
            
        }

    }
// check if form is valid
    isFormValid = ({ email, password }) => {
        return email && password
    }

// add special styling to field that has error to indicate to user
    handleInputErrors = (errors, inputName) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(inputName)
        )
            ? "error"
            : ""
    }

    render() {
        const { email, password, errors, loading } = this.state
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app" >
                <Grid.Column style={{ maxWidth: 450 }} >
                    <Header as="h1" icon color="violet" textAlign="center" >
                        <Icon name="slack" color="violet" />
                        Login to Slick
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit} >
                        <Segment>
                         

                            <Form.Input
                                fluid
                                name="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email Address"
                                onChange={this.handleChange}
                                value={email}
                                type="email"
                                className={this.handleInputErrors(errors, "email")}
                            />

                            <Form.Input
                                fluid
                                name="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                onChange={this.handleChange}
                                value={password}
                                type="password"
                                className={this.handleInputErrors(errors, "password")}
                            />


                            <Button
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                                color="violet"
                                fluid size="large"
                            >
                                Submit
                            </Button>

                        </Segment>
                    </Form>

                    {
                        errors.length > 0
                            ? (
                                <Message error>
                                    <h3>Errors</h3>
                                    {this.displayErrors(errors)}
                                </Message>
                            )
                            : null
                    }

                    <Message>Don't have an account? <Link to="/register">Register</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login