import React from 'react';

import {connect} from "react-redux"

import { Grid } from "semantic-ui-react"

import './App.css';

// Import Compoenents
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel"


const App = ({ currentUser }) => {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }} >
      <ColorPanel/>
      <SidePanel currentUser={currentUser} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
      
      
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser
  }

}

export default connect(mapStateToProps)(App);
