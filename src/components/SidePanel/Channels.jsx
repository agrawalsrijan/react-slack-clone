import React, { Component } from "react";

import {connect} from "react-redux"

import {setCurrentChannel, setPrivateChannel} from "../../actions/index"

import firebase from "../../firebase"

import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react"

class Channels extends Component {
    state = {
        activeChannel: "",
        user: this.props.currentUser,
        channels: [],
        channelName: "",
        channelDetails: "", 
        modal: false,
        channelsRef: firebase.database().ref("channels"),
        firstLoad: true
    }

    componentDidMount(){
        this.addListeners()
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snapshot => {
            loadedChannels.push(snapshot.val());
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel())
        })
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    };

// set first channel by default on page/app load

    setFirstChannel = () => {
        const { firstLoad, channels } = this.state
        const firstChannel = channels[0]
        if(firstLoad && channels.length > 0){
            this.props.setCurrentChannel(firstChannel)
            this.setActiveChannel(firstChannel);
        }
        this.setState({ firstLoad: false });
    }

// handle input change    
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

// Submit channel create form

    handleSubmit = event => {
        event.preventDefault()
        if(this.isFormValid(this.state)){
            this.addChannel()
        }
    }

// Add channel fucntion

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelDetails: "", channelName: "" });
                this.closeModal();
                console.log('channel added');
            }).catch(err => {
                console.error(err);
            })
    }

// form validation checker

    isFormValid = ({ channelName, channelDetails }) => {
        return channelName && channelDetails
    }



// Open channel create Modal
    openModal = () => {
        this.setState({ modal: true })
    }

// Close channel create Modal
    closeModal = () => {
        this.setState({ modal: false })
    }

// display channels
    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={ channel.id === this.state.activeChannel }
            >
                # {channel.name}

            </Menu.Item>
        ))
    )
// change channel
    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false)
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }


    render(){
        const { channels, modal } = this.state
        return(
            <React.Fragment>
                <Menu.Menu ckassname="menu" >
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>{"  "}
                     ({channels.length}) <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {/* Channels show */}
                    { this.displayChannels(channels) }
                </Menu.Menu>


                {/* Add channel Modal */}
                <Modal basic open={modal} onClose={this.closeModal} >
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>

                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>

                        </Form>
                    </Modal.Content>

                    <Modal.Actions>

                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark" /> Add
                        </Button>

                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>

                    </Modal.Actions>
                </Modal>
            </React.Fragment>
            

        )
    }
}

export default connect(
    null, 
    { setCurrentChannel, setPrivateChannel }
)(Channels);