import * as React from "react";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";

import Axios from "axios";
import { IShow } from "../../interfaces/IShow";

export const GitShows = () => {

    const queryShows = useQuery("shows", () =>
        fetch(`http://${process.env.PUBLIC_HOSTNAME}/api/shows`).then((res) => {
            return res.json();
        }).catch((error) => {
            console.log(error);
        })
    );

    return queryShows.data?.map(result => {
        return <div key={result.Title}>{result.Title}</div>;
    }) ?? null;
};
