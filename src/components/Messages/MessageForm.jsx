import React, { Component } from "react";

import firebase from "../../firebase"

import { Segment, Button, Input } from "semantic-ui-react"



class MessageForm extends Component {
    state = {
        message: "",
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: []
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = () => {
        const { user } = this.state
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL 
            },
            content: this.state.message,
        };
        return message
    }

    sendMessage = () => {
        const { messagesRef } = this.props
        const { message, channel, errors } = this.state

        if(message) {
            this.setState({ loading: true })
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: "", errors: [] })
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ 
                        loading: false, 
                        errors: errors.concat(err) 
                    })

                })
        }else {
            this.setState({
                errors: errors.concat("Add a Message")
            })
        }
    }

    render() {
        const { errors, message } = this.state
        return (
            <Segment className="message__form" >
                <Input
                    fluid
                    name="message"
                    value={message}
                    style={{ marginBottom: '0.7em' }}
                    label={ <Button icon="add"/> }
                    labelPosition="left"
                    placeholder="Write your Message"
                    onChange={this.handleChange}
                    className={
                        errors.some(error => error.message.includes('message')) 
                            ? 'error' 
                            : ''
                    }
                />

                <Button.Group icon widths="2">

                    <Button
                        onClick={this.sendMessage}
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />


                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />

                </Button.Group>
            </Segment>
        )
    }
}

export default MessageForm