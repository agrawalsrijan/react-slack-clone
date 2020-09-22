import React, { Component } from "react"
import { Link } from "react-router-dom"

import md5 from "md5"

// Firebase import
import firebase from "../../firebase"

//import semantic-ui-react elements
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react"

class Register extends Component {
    state={
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    }
    isFormValid = () => {
        let errors = [];
        let error;
        if(this.isFormEmpty(this.state)) {
            // throw errors
            error = { message: "Fill in all fields" }
            this.setState({ errors: errors.concat(error) })
            return false
        }else if(!this.isPasswordValid(this.state)){
            // throw errors
            error = { message: "Password is invalid" }
            this.setState({ errors: errors.concat(error) })
            return false
        }else{
            // form valid
            return true
        }
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length
    }
    isPasswordValid = ({ password, passwordConfirmation }) => {
        if(password.length < 6 || passwordConfirmation.length < 6){
            return false
        }else if (password !== passwordConfirmation){
            return false
        }else{
            return true
        }
    }

    displayErrors = errors => {
        return errors.map((error, i) => <p key={i}>{error.message}</p>)
    } 
// handle change in inputs in form
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value, errors: [] })
    }
// submit register form
    handleSubmit = event => {
        event.preventDefault()
        if(this.isFormValid()){
            const { username, email, password, errors } = this.state
            this.setState({ errors: [], loading: true })
            
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(createdUser => {
                    console.log(createdUser);
                    // firebase method to updateUserdata
                    createdUser.user.updateProfile({
                        displayName: username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                    .then(() => {
                        
                        this.saveUser(createdUser).then(() => {
                            console.log("user saved");
                            this.setState({ loading: false })
                        })
                    }).catch(err => {
                        console.error(err);
                        this.setState({ errors: errors.concat(err), loading: false })
                    })
                }).catch(err => {
                    console.error(err);
                    this.setState({ errors: errors.concat(err), loading: false })
                })
        }
      
    }

// Save the created user

    saveUser = createdUser => {
        const { usersRef } = this.state
        return usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
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
        const { username, email, password, passwordConfirmation, errors, loading } = this.state
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app" >
                <Grid.Column style={{ maxWidth: 450 }} >
                    <Header as="h1" icon color="orange" textAlign="center" >
                        <Icon name="puzzle piece" color="orange"/>
                        Register for Slick
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit} >
                        <Segment>
                            <Form.Input 
                                fluid
                                name="username"
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                onChange={this.handleChange}
                                value={username}
                                type="text"
                            /> 

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

                            <Form.Input
                                fluid
                                name="passwordConfirmation"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Confirm Password"
                                onChange={this.handleChange}
                                value={passwordConfirmation}
                                type="password"
                                className={this.handleInputErrors(errors, "password")}
                            />

                            <Button
                                disabled={loading} 
                                className={loading ? 'loading' : ''}
                                color="orange" 
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

                    <Message>Already a user? <Link to="/login">Login</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register