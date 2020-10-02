import React from "react"

import firebase from "../../firebase"

import  { connect } from "react-redux"
import { setCurrentChannel, setPrivateChannel } from "../../actions/index"

import { Menu, Icon, Modal, Form, Input, Button, Label } from "semantic-ui-react"

class  Starred extends React.Component {

    state = {
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        activeChannel : "",
        starredChannels : []
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid);
        }
        
    }

    addListeners = (userId) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_added', snap => {
                const starredChannel = { id: snap.key, ...snap.val() }
                this.setState({
                    starredChannels: [...this.state.starredChannels, starredChannel]
                })
            })

        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_removed', snap => {
                const channelToRemove  = { id: snap.key, ...snap.val() }
                const filteredChannels = this.state.starredChannels.filter(channel => channel.id !== channelToRemove.id)

                this.setState({ starredChannels: filteredChannels })
            })

    }

    // display channels
    displayChannels = starredChannels => (
        starredChannels.length > 0 && starredChannels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === this.state.activeChannel}
            >
                
                # {channel.name}

            </Menu.Item>
        ))
    )

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    // change channel
    changeChannel = channel => {
        this.setActiveChannel(channel);

        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        
    }

    render() {
        const  { starredChannels } = this.state
        return (
            <Menu.Menu ckassname="menu" >
                <Menu.Item>
                    <span>
                        <Icon name="star" /> STARRED
                        </span>{"  "}
                     ({starredChannels.length}) 
                </Menu.Item>
                {/* Channels show */}
                { this.displayChannels(starredChannels)}
            </Menu.Menu>
        )
    }
}


export default connect(null,{ setCurrentChannel, setPrivateChannel })(Starred);