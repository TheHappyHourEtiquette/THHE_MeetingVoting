import * as React from "react";
import { Provider, Flex, Text, Button, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";

/**
 * Implementation of the Meeting Voting content page
 */
export const MeetingVotingPanellists = () => {

    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string>();

    /**
     * The render() method to create the UI of the tab
     */
    return (
        <Flex.Item>
            <div id="large+@item.RoundName+panellist.Title" className="panellistBlock">
                <div className="panellistInfo">panellist.Title</div>
                <br/>
                <div className="panellistInfo">
                    <img src="panellist.ImageUrl" className="panellistImage" />
                </div>
                <br/>
                <div className="panellistInfo">@item.PanellistScore[panellist]</div>
                <br/>
            </div>
        </Flex.Item>
    );
};
