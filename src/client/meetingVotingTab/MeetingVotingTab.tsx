import * as React from "react";
import { Provider, Flex, Text, Button, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";
import { MeetingVotingShowHeader } from "./MeetingVotingShowHeader";
import Axios from "axios";
import { IShow } from "../../interfaces/IShow";

/**
 * Implementation of the Meeting Voting content page
 */
export const MeetingVotingTab = () => {

    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [shows, setShows] = useState<IShow>();
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.authentication.getAuthToken({
                successCallback: (token: string) => {
                    const decoded: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
                    setName(decoded!.name);
                    microsoftTeams.appInitialization.notifySuccess();
                },
                failureCallback: (message: string) => {
                    setError(message);
                    microsoftTeams.appInitialization.notifyFailure({
                        reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                        message
                    });
                },
                resources: [process.env.TAB_APP_URI as string]
            });
        } else {
            setEntityId("Not in Microsoft Teams");
        }
    }, [inTeams]);

    const fetchShows = async () => {
        console.log("Getting shows");
        // const response = await Axios.get<IShow>(`http://${process.env.PUBLIC_HOSTNAME}/api/shows`, {});
        const response = await fetch(`http://${process.env.PUBLIC_HOSTNAME}/api/shows`);
        return response.json();
    };

    const { data, status } = useQuery<IShow>("shows", fetchShows, {
        staleTime: 5000
    });
    useEffect(() => {
        setShows(data ?? []);
    }, [data]);

    /**
     * The render() method to create the UI of the tab
     */
    return (
        <Provider theme={theme}>
            <Flex fill={true} column styles={{
                padding: ".8rem 0 .8rem .5rem",
                backgroundColor: "black"
            }}>
                <MeetingVotingShowHeader />
                <Flex.Item>
                    <div className="agendaSubTitle">@Model.Title</div>
                </Flex.Item>
                <Flex.Item>
                    <div>
                        {shows}
                    </div>
                </Flex.Item>
                <Flex.Item>
                    <div id="list">
                        Panellist name
                    </div>
                </Flex.Item>
                <Flex.Item>
                    <div className="agendaSubTitle">Rounds:</div>
                </Flex.Item>
                <Flex.Item>
                    <div id="list">
                        <ol type="1" id="questionList">
                            Question
                        </ol>
                    </div>
                </Flex.Item>
                <Flex.Item>
                    <div>
                        <div id="item.RoundName" className="questionBlock">
                            <div>@item.RoundName</div>
                            <div id="large+@item.RoundName+panellist.Title" className="panellistBlock">
                                <div className="panellistInfo">panellist.Title</div>
                                <br/>
                                <div className="panellistInfo">
                                    <img src="panellist.ImageUrl" className="panellistImage" />
                                </div>
                                <br/>
                                <div className="panellistInfo">@item.PanellistScore[panellist]</div>
                                <br/>
                                <span>Up</span>
                                <span>Hallelujah</span>
                                <span>Down</span>
                            </div>
                            <div className="panellistScoreBlock">
                                <div className="panellistInfo">panellist.Title</div>
                                <div className="panellistInfo">
                                    <img src="panellist.ImageUrl" className="panellistImage" />
                                </div>
                                <div className="panellistInfo">@item.PanellistScore[panellist]</div>
                            </div>
                        </div>
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
