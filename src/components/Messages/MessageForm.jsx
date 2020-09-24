import React, { Component } from "react";
import uuidv4 from "uuid/dist/v4"
import firebase from "../../firebase"

import { Segment, Button, Input } from "semantic-ui-react"

import FileModal from "./FileModal"
import ProgressBar from "./ProgressBar";



class MessageForm extends Component {
    state = {
        message: "",
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        storageRef: firebase.storage().ref(),
        percentUploaded: 0
    }

    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false })

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = (fileUrl = null) => {
        const { user } = this.state
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL 
            },
        };
        if (fileUrl !== null) {
            message['image'] = fileUrl
        } else {
            message['content'] = this.state.message
        }
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

    uploadFile = ( file, metadata ) => {
        console.log(file, metadata);
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filePath = `chat/public/${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snapshot => {
                    const percentUploaded = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) *100)
                    this.props.isProgressBarVisible(percentUploaded);
                    this.setState({
                        percentUploaded
                    })
                },
                    err => {
                        console.error(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: "error",
                            uploadTask: null
                        })
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            this.sendFileMessage(downloadUrl, ref, pathToUpload)
                        })
                        .catch(err => {
                            console.error(err);
                            this.setState({
                                errors: this.state.errors.concat(err),
                                uploadState: "error",
                                uploadTask: null
                            })
                        })
                    }
                )
            }
        )

    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done' })
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    uploadState: "error",
                    uploadTask: null
                })
            })
    }

    render() {
        const { errors, message, loading, modal, uploadState, percentUploaded } = this.state
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
                        disabled={loading}
                    />


                    <Button
                        color="teal"
                        onClick={this.openModal}
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />

                </Button.Group>


                <FileModal
                    modal={modal}
                    closeModal={this.closeModal}
                    uploadFile={this.uploadFile}
                />

                <ProgressBar
                    uploadState={uploadState}
                    percentUploaded={percentUploaded}
                />
            </Segment>
        )
    }
}

export default MessageForm