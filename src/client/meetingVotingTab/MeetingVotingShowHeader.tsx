import * as React from "react";
import { Provider, Flex, Text, Button, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";

/**
 * Implementation of the Meeting Voting content page
 */
export const MeetingVotingShowHeader = () => {

    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string>();

    // TODO: Make showname a property
    /**
     * The render() method to create the UI of the tab
     */
    return (
        <Flex.Item>
            <div>
                <div className="agendaTitle">
                    The Happy Hour Etiquette presents
                </div>
                <div>
                    Show 1
                </div>
            </div>
        </Flex.Item>
    );
};
