import React, { Component } from "react";

// import { connect } from "react-redux"

// Firebase imports
import firebase from "../../firebase.js";

// Semantic UI imports
import { Dropdown, Grid, Header, Icon, Image } from "semantic-ui-react"

class UserPanel extends Component{

    state = {
        user: this.props.currentUser
    }

// Dropwdown Menu Options
    dropdownOptions = () => {
        const { user } = this.state
        return [
            {
                key: "user",
                text : <span>Signed in as <strong>{user.displayName}</strong></span>,
                disabled: true
            },
            {
                key: "avatar",
                text: <span>Change Avatar</span>
            },
            {
                key: "signout",
                text: <span onClick={this.handleSignout} >Sign Out</span>
            }
        ]
    }

// Handle signout functionality
    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("signed out"))
    }

    render(){
        const { user } = this.state
        return(
            <Grid style={{ background: "#4c3c4c" }} >
                <Grid.Column>
                    <Grid.Row style={{ padding: "1.2em" , margin: 0}} >
                        {/* Main app header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>Slick</Header.Content>
                        </Header>

                        {/* User DropDown */}
                        <Header style={{ padding: "0.25em", marginTop: "4rem" }} as="h4" inverted>
                            <Dropdown
                                trigger={
                                    <span>
                                        <Image
                                            src={user.photoURL}
                                            spaced="right"
                                            avatar
                                        />

                                        {user.displayName}
                                    </span>
                                }
                                options={this.dropdownOptions()}
                            />
                        </Header>

                    </Grid.Row>

                 

                </Grid.Column>
            </Grid>
        )
    }
}

// const mapStateToProps = state => {
//     return{
//         currentUser: state.user.currentUser
//     }
    
// }

export default UserPanel