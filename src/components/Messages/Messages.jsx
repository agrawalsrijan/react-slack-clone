import React, { Component } from "react";

import firebase from "../../firebase"

import { Segment, Comment } from "semantic-ui-react"

import MessagesHeader from "./MessagesHeader"
import MessageForm from "./MessageForm";
import Message from "./Message"

class Messages extends Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true
    }

    componentDidMount(){
        const { channel, user } = this.state;

        if(channel && user){
            this.addListeners(channel.id);
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        const { messagesRef } = this.state
        let loadedMessages = [];
        messagesRef.child(channelId).on('child_added', snapshot => {
            loadedMessages.push(snapshot.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
        })
    }
    
    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )

    render() {
        const { messagesRef, messages, channel, user } = this.state
        return (
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">

                        {/* messages */}

                        {
                            this.displayMessages(messages)
                        }

                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                />
            </React.Fragment>
        )
    }
}

export default Messages