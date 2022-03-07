import { GmailCtx, MissingGmailMessageError } from "./GmailCtx";

export class FreezoneMailer {
    private gmailCtx = new GmailCtx();
    public readonly Ready: Promise<this>;

    constructor(){
        this.Ready = new Promise(async makeready => {
            await this.gmailCtx.Ready;
            makeready(this);
        })
    }

    private parse(source: string, pattern: RegExp): string {
        const matches = source.match(pattern)??[];
        if (!matches.length){
            throw new Error(`no matches for pattern: ${pattern} in source:\n${source}`);
        }
        return matches[0];
    }

    private parseSignupCode(source: string) {
        return this.parse(source, /[0-9]{6}/);
    }

    private parseSignupLink(source: string): string {
        return this.parse(source, /https\S+/);
    }

    public async latestSignupCode(): Promise<string> {
        try {
            return this.parseSignupCode(
                await this.gmailCtx.latestFreezoneSignupCodeMsg());
        } catch (error) {
            if (error instanceof MissingGmailMessageError){
                console.log("no messages yet...");
                return this.latestSignupCode();
            } else {
                throw error;
            }
        }
    }

    public async latestSignupLink(): Promise<string> {
        try {
            return this.parseSignupLink(
                await this.gmailCtx.latestFreezoneSignupLinkMsg());
        } catch (error) {
            if (error instanceof MissingGmailMessageError){
                console.log("no messages yet...");
                return this.latestSignupLink();
            } else {
                throw error;
            }
        }
    }
}