import express = require("express");
// import jwt, { JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import { AppAuthentication, createOAuthAppAuth } from "@octokit/auth-oauth-app";
import Axios from "axios";
import { Chat } from "@microsoft/microsoft-graph-types";
import { getItem, setItem } from "node-persist";
import jwtDecode from "jwt-decode";
import * as GreyMatter from "gray-matter";
import { IShow } from "../../interfaces/IShow";
import { Octokit } from "@octokit/rest";
import { IPanellist } from "../../interfaces/IPanellist";
import { IQuestion } from "../../interfaces/IQuestion";
import { IDefendTheIndefensible } from "../../interfaces/IDefendTheIndefensible";

export const GitHubRouter = (options: any): express.Router => {
    const router = express.Router();

    const validateToken = (req: express.Request): Promise<AppAuthentication> => {
        return new Promise((resolve, reject) => {
            // console.log(process.env.GITHUB_APP_ID );
            const auth = createOAuthAppAuth({
                clientType: "oauth-app",
                clientId: process.env.GITHUB_APP_ID as string,
                clientSecret: process.env.GITHUB_APP_SECRET as string
            });

            return auth({
                type: "oauth-app"
            });
        });
    };

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    async function loadShows():Promise<IShow[]> {
        console.log("Load shows");
        const shows: IShow[] = [];

        const octokit = new Octokit({
            // authStrategy: validateToken
            auth: process.env.GITHUB_TOKEN as string
        });
        const { data } = await octokit.request("/repos/TheHappyHourEtiquette/THHE-Shows/contents/shows");
        // const chatInfo = await Axios.get<IShow[]>("https://api.github.com/repos/TheHappyHourEtiquette/THHE-Shows/contents/shows", {});
        // console.log("data received");
        const panellist: IPanellist = {
            Title: "Test host",
            ImageUrl: "",
            TotalScore: 0
        };
        const panellists: IPanellist[] = [];
        panellists.push(panellist);
        const questions: IQuestion[] = [];
        const indefensibles: IDefendTheIndefensible[] = [];

        const show: IShow = {
            Title: "test",
            Host: panellist,
            Panellists: panellists,
            Questions: questions,
            DefendTheIndefensibles: indefensibles
        };
        // console.log("pushing shows");
        // console.log(show);
        // shows.push(show);

        for (const showData of data) {
            // console.log("loading show " + showData.name);
            const showPath = `shows/${showData.name}`;
            const showContents = await octokit.repos.getContent({
                mediaType: {
                    format: "raw"
                },
                owner: "TheHappyHourEtiquette",
                repo: "THHE-Shows",
                path: showPath
            });
            // console.log("show loaded");
            // console.log(showContents);
            const showDetails = GreyMatter(showContents.data.toString());

            const panellist: IPanellist = {
                Title: showDetails.data.host,
                ImageUrl: "",
                TotalScore: 0
            };
            const panellists: IPanellist[] = [];
            panellists.push(panellist);
            const questions: IQuestion[] = [];
            const indefensibles: IDefendTheIndefensible[] = [];

            // console.log(showDetails.data.title);
            const show: IShow = {
                Title: showData.name,
                Host: panellist,
                Panellists: panellists,
                Questions: questions,
                DefendTheIndefensibles: indefensibles
            };
            // console.log("pushing shows");
            // console.log(show);
            shows.push(show);
        };

        return shows;
    }

    router.get(
        "/shows",
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                // console.log("retrieving token details");
                // console.log("retrieving data");
                const shows: IShow[] = await loadShows();
                res.type("application/json");
                // console.log(shows);
                // TODO: identify why results not being returned to API
                // console.log(JSON.stringify(shows));
                res.end(JSON.stringify(shows));
                // res.end(shows);
            } catch (err) {
                console.log(err);
                throw new Error("500");
            }
        });

    /*
    router.post(
        "/chatMessage/:meetingId",
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                const token = await validateToken(req);

                const oboRequest: OnBehalfOfRequest = {
                    oboAssertion: token,
                    scopes: ["Chat.ReadWrite"]
                };

                try {
                    const cca = new ConfidentialClientApplication(msalConfig);
                    const response = await cca.acquireTokenOnBehalfOf(oboRequest);

                    if (response && response.accessToken) {
                        try {
                            const meetingId = req.params.meetingId;
                            const chatId = Buffer.from(meetingId, "base64").toString("ascii").replace(/^0#|#0$/g, "");

                            await Axios.post<Chat>(`https://graph.microsoft.com/v1.0/chats/${chatId}/messages`, req.body, {
                                headers: {
                                    Authorization: `Bearer ${response.accessToken}`
                                }
                            });

                            res.type("application/json");
                            res.end();
                        } catch (err) {
                            throw new Error("500");
                        }
                    } else {
                        throw new Error("403");
                    }
                } catch (e) {
                    throw new Error("500");
                }
            } catch (e) {
                res.type("application/json");
                res.end(JSON.stringify({}));
            }
        });

    router.get(
        "/bingoTopics/:meetingId",
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                const token = await validateToken(req);

                const meetingId = req.params.meetingId;
                const storedTopics = await getItem(meetingId) || [];
                res.type("application/json");
                res.end(JSON.stringify(storedTopics));
            } catch (e) {
                res.status(500).send(e);
            }
        });

    router.post(
        "/bingoTopics/:meetingId",
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                const token = await validateToken(req);

                const meetingId = req.params.meetingId;
                const storedTopics = req.body;
                await setItem(meetingId, storedTopics);
                res.type("application/json");
                res.end(JSON.stringify(storedTopics));
            } catch (e) {
                res.status(500).send(e);
            }
        });
        */

    return router;
};
