import React, { Component } from "react";

import {connect} from "react-redux"

import {setCurrentChannel, setPrivateChannel} from "../../actions/index"

import firebase from "../../firebase"

import { Menu, Icon, Modal, Form, Input, Button, Label } from "semantic-ui-react"

class Channels extends Component {
    state = {
        activeChannel: "",
        user: this.props.currentUser,
        channels: [],
        channel: null,
        channelName: "",
        channelDetails: "", 
        modal: false,
        channelsRef: firebase.database().ref("channels"),
        messagesRef: firebase.database().ref('messages'),
        typingRef: firebase.database().ref('typing'),
        notifications : [],
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
            this.addNotificationListener(snapshot.key)
        })
    }

    addNotificationListener = channelId => {
        this.state.messagesRef.child(channelId).on('value', snap => {
            if (this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            } 
        })
    }

    handleNotifications = (channelId, currenChannelId, notifications, snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === channelId);

        if (index !== -1) {
            if (channelId !== currenChannelId) {
                lastTotal = notifications[index].total;

                if(snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }

            notifications[index].lastKnownTotal = snap.numChildren()
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            })
        }

        this.setState({ notifications })
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
            this.setState({ channel: firstChannel })
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

// Get count of notifications

    getNotificationCount = channel => {
        let count = 0 ;

        this.state.notifications.forEach(notification => {
            if (notification.id === channel.id) {
                count = notification.count
            }
        })
        
        if (count > 0) return count
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
                {this.getNotificationCount(channel) && (
                    <Label color="red" >{this.getNotificationCount(channel)}</Label>
                )}
                # {channel.name}

            </Menu.Item>
        ))
    )
// change channel
    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.state.typingRef
            .child(this.state.channel.id)
            .child(this.state.user.uid)
            .remove()
        this.clearNotifications()
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel })
    }

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id)
        
        if (index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total  = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({ notifications: updatedNotifications })
        }
    
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