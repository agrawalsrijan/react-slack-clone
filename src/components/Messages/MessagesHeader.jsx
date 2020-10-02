import React, { Component } from "react";

import { Segment, Header, Input, Icon} from "semantic-ui-react"

class MessagesHeader extends Component {

    render() {
        const { channelName, numUniqueUsers, 
                handleSearchChange,searchLoading, isPrivateChannel, handleStar, isChannelStarred } = this.props
        return (
            <Segment clearing>
            {/* Channel title */}

                <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
                    <span>
                        {channelName}
                        {!isPrivateChannel && (
                            <Icon 
                                onClick={handleStar} 
                                name={isChannelStarred ? 'star' : 'star outline'}
                                color={isChannelStarred ? 'yellow' : 'black'}
                            />
                            )}
                    </span>
                   <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>

            {/* Channel Search Input */}

                <Header floated="right">
                    <Input
                        loading={searchLoading}
                        onChange={handleSearchChange}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages"
                    />
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader