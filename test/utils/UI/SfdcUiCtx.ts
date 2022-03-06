import { Page } from "@playwright/test";
import { LoginPage } from "../../locators/sfdc/LoginPage";
import { CredentialsHandler } from "../Common/CredentialsHandler";
import { UserCredentials } from "../Common/CredentialsStructure";
import { Environment } from "../Common/Environment";
import { SfCredentials } from "../Common/SfCredentials";
import { User } from "../Common/User";

export class SfdcUiCtx {
    private credentials: SfCredentials;

    public Ready: Promise<SfdcUiCtx>;
    public readonly user: User;
    public readonly environment: Environment;


    constructor(environment: Environment, user: User) {
        this.environment = environment;
        this.user = user;
        this.Ready = new Promise(async (ready) => {
            this.credentials = await new SfCredentials().Ready;
            ready(this);
        })
    }

    public async loginOn(page: Page): Promise<void> {
        const credentials: UserCredentials = await this.credentials
            .userCredentialsFor(this.environment, this.user);
        const baseUrl: string = await this.credentials
            .environmentDataFor(this.environment).baseUrl;
        await LoginPage.authenticateUsing(page, baseUrl, credentials);
    }

    public async logoutFrom(page: Page): Promise<void> {
        const baseUrl: string = await this.credentials
            .environmentDataFor(this.environment).baseUrl;
        await page.goto(`${baseUrl}/secur/logout.jsp`, { waitUntil: 'networkidle' });
    }
}