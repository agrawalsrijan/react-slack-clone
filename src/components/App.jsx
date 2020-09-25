import React from 'react';

import {connect} from "react-redux"

import { Grid } from "semantic-ui-react"

import './App.css';

// Import Compoenents
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel"


const App = ({ currentUser, currentChannel, isPrivateChannel }) => {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }} >
      {/* <ColorPanel/> */}

      <SidePanel
        key={currentUser && currentUser.uid} 
        currentUser={currentUser} 
      />

      <Grid.Column style={{ marginLeft: 270 }}>
        <Messages 
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser} 
          isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
      
      
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel
  }

}

export default connect(mapStateToProps)(App);
