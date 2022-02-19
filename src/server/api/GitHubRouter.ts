import express = require("express");
// import jwt, { JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import { Jwt, JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import { ClientCredentialRequest, ConfidentialClientApplication, OnBehalfOfRequest } from "@azure/msal-node";
import Axios from "axios";
import { Chat } from "@microsoft/microsoft-graph-types";
import { getItem, setItem } from "node-persist";
import jwtDecode from "jwt-decode";
import { IShow } from "../../interfaces/IShow";

export const GraphRouter = (options: any): express.Router => {
    const router = express.Router();

    /**
     * Token Validation Code Credits go to Elio Struyf
     * https://www.eliostruyf.com/oauth-behalf-flow-node-js-azure-functions/
     */
    const msalConfig = {
        auth: {
            clientId: process.env.TAB_APP_ID as string,
            clientSecret: process.env.TAB_APP_SECRET,
            authority: process.env.TAB_AUTHORITY
        }
    };
    /*
    const getSigningKeys = (header: JwtHeader, callback: SigningKeyCallback) => {
        const client = new JwksClient({
            jwksUri: "https://login.microsoftonline.com/common/discovery/keys"
        });

        client.getSigningKey(header.kid, function (err, key: any) {
            callback(err, key.publicKey || key.rsaPublicKey); // eslint-disable-line node/handle-callback-err
        });
    };

    const validateToken = (req: express.Request): Promise<string> => {
        return new Promise((resolve, reject) => {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(" ").pop();

                if (token) {
                    const validationOptions = {
                        audience: `api://${process.env.PUBLIC_HOSTNAME}/${process.env.TAB_APP_ID}`
                    };

                    jwt.verify(token, getSigningKeys, validationOptions, (err, payload) => {
                        if (err) {

                            reject(new Error("403"));
                            return;
                        }

                        resolve(token);
                    });
                } else {
                    reject(new Error("401"));
                }
            } else {
                reject(new Error("401"));
            }
        });
    };
    */
    /**
     * End: Token Validation Code
     */

    router.get(
        "/shows",
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                const chatInfo = await Axios.get<IShow[]>("https://api.github.com/repos/TheHappyHourEtiquette/THHE-Shows/contents/shows", {});
                res.type("application/json");
                res.end(JSON.stringify(chatInfo?.data));
            } catch (err) {
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
