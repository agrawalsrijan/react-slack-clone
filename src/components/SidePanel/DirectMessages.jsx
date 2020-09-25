import React from "react"
import { connect } from "react-redux"
import { setCurrentChannel, setPrivateChannel } from "../../actions/index"

import firebase from "firebase"

import { Menu, Icon } from "semantic-ui-react"

class DirectMessages extends React.Component {

    state ={ 
        user: this.props.currentUser,
        users: [],
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence')
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid)
        }
    }

    addListeners = currentUserUid => {
        let loadedUsers = []

        this.state.usersRef.on('child_added', snapshot => {
            if (currentUserUid !== snapshot.key) {
                let user = snapshot.val();
                user['uid'] = snapshot.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
                this.setState({ users: loadedUsers })
            }
        })

        this.state.connectedRef.on('value', snapshot => {
            if (snapshot.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUid)
                ref.set(true)
                ref.onDisconnect().remove(err => {
                    if (err !== null) {
                        console.error(err);

                    }
                })
            }
        })


        this.state.presenceRef.on('child_added', snapshot => {
            if (currentUserUid !== snapshot.key) {
                // add status to user
                this.addStatusToUser(snapshot.key)
            }
        })


        this.state.presenceRef.on('child_removed', snapshot => {
            if (currentUserUid !== snapshot.key) {
                // add status to user
                this.addStatusToUser(snapshot.key, false)
            }
        })
    }

    addStatusToUser = (userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline' }`
            }

            return acc.concat(user)
        }, [])

        this.setState({ users: updatedUsers })
    }

    isUserOnline = user => {
        return user.status === 'online'
    }

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid)
        const channelData = {
            id: channelId,
            name: user.name
        }

        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
    }

    getChannelId = userId => {
        const currentUserId = this.state.user.uid;
        return userId < currentUserId ?
            `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
    }

    render() {
        const { users } = this.state

        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="mail" /> Direct Messages
                    </span>{" "}
                    ({ users.length })
                </Menu.Item>
                {/* Users to send direct mesages */}

                {
                    users.map((user,i) => (
                        <Menu.Item
                            key={i}
                            onClick={() => this.changeChannel(user)}
                            style={{ opacity: 0.7, fontStyle: 'italic' }}
                        >
                            <Icon 
                                name='circle'
                                color={this.isUserOnline(user) ? 'green' : 'red'}
                            />

                            @ {user.name}

                        </Menu.Item>
                    ))
                }

            </Menu.Menu>
        )
    }
}

export default  connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages)