import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/meetingVotingTab/index.html")
@PreventIframe("/meetingVotingTab/config.html")
@PreventIframe("/meetingVotingTab/remove.html")
export class MeetingVotingTab {
}
