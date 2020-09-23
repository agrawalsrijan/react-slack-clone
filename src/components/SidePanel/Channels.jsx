import React, { Component } from "react";

import { Menu, Icon } from "semantic-ui-react"

class Channels extends Component {
    state = {
        channels: []
    }
    render(){
        const { channels } = this.state
        return(
            <Menu.Menu style={{ paddingBottom: "2em" }} >
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> CHANNELS
                    </span>{"  "}
                     ({ channels.length }) <Icon name="add"/>
                </Menu.Item>
                {/* Channels show */}
            </Menu.Menu>

        )
    }
}

export default Channels