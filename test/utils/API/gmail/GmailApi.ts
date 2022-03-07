import { google } from "googleapis";
import { gmail_v1 } from "googleapis";
import { GmailCredentialsHandler } from "../../common/credentials/GmailCredentialsHandler";

export class GmailCtx {
    private gmail: gmail_v1.Gmail;
    private readonly context: string = 'me';
    public readonly Ready: Promise<this>;

    constructor(){
        this.Ready = new Promise(async makeReady => {
            const gmailSecrets = (await new GmailCredentialsHandler().Ready).credentials();
            const oAuth2Client = new google.auth.OAuth2(
                    gmailSecrets.credentials.installed.client_id, 
                    gmailSecrets.credentials.installed.client_secret,
                    gmailSecrets.credentials.installed.redirect_uris[0]);
                    oAuth2Client.setCredentials(gmailSecrets.token);
            this.gmail = google.gmail({ version: 'v1', auth: oAuth2Client});
            makeReady(this);
        })
    }

    public async readMessageById(id: string): Promise<gmail_v1.Schema$Message> {
        return (await this.gmail.users.messages.get({
            id: id,
            userId: this.context,
        })).data as gmail_v1.Schema$Message; 
    }

    public async readMessagesByQuery(query: string): Promise<any> {
        (await this.gmail.users.messages.list({
            q: query,
            userId: this.context,
        })).data.messages?.forEach(async msg => {
            if (!msg.id) {
                throw new Error(`missing id for message:\n${msg}`);
            }
            console.log(await this.readMessageById(msg.id));
        })
    }
}