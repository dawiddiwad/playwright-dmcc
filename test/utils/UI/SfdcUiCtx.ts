import { Page } from "@playwright/test";
import { Environment } from "../Common/Environment";
import { User } from "../Common/User";

export class SfdcUiCtx {
    public Ready: Promise<SfdcUiCtx>;

    public readonly user: User;
    public readonly environment: Environment;

    constructor(environment: Environment, user: User){
        this.environment = environment;
        this.user = user;
        this.Ready = new Promise(async (ready, failed) => {
            
        })
    }

    public async loginUsing(page: Page): Promise<void> {

    }

    public async logoutFrom(page: Page): Promise<void> {

    }
}