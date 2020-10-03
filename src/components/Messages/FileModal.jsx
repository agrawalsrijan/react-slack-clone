import React, { Component } from "react"

import mime from "mime-types"

import { Button, Modal, Input, Icon } from "semantic-ui-react"
class FileModal extends Component{
    state = {
        file: null,
        authorized: ['image/jpeg', 'image/png', 'image/jpg', 'image/JPG', 'image/PNG', 'image/JPEG']
    }

    addFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            this.setState({ file: file })
        }
    }

    sendFile = () => {
        const {file} = this.state
        const { uploadFile, closeModal } = this.props
        if (file !== null) {
            if(this.isAuthorized(file.name)) {
                // send file
                const metadata = { contentType: mime.lookup(file.name) };
                uploadFile(file, metadata);
                closeModal()
                this.clearFile()
            }
        }
    }

    isAuthorized = fileName => {
        const { authorized } = this.state
        return authorized.includes(mime.lookup(fileName));
    }

    clearFile = () => {
        this.setState({ file: null })
    }

    render(){
        const { modal, closeModal } = this.props
        return(
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Select an Image file</Modal.Header>

                <Modal.Content>
                    <Input 
                        onChange={this.addFile}
                        fluid
                        label="File types: jpg, png"
                        name="file"
                        type="file"
                    />
                    
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={this.sendFile}
                        color="green"
                        inverted
                    >
                        <Icon name="checkmark"/> Send
                    </Button>

                    <Button
                        color="red"
                        inverted
                        onClick={closeModal}
                    >
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default FileModal


// hello


