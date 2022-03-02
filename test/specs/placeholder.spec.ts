import test from "@playwright/test";
import { Environment } from "../utils/Common/Environment";
import { User } from "../utils/Common/User";
import { SfdcUiCtx } from "../utils/UI/SfdcUiCtx";

test.describe.parallel("placeholder", () => {
    test("test", async ({page}) => {
        test.slow();
        const UI = await new SfdcUiCtx(Environment.PROD, User.SYSADMIN).Ready

        await UI.loginOn(page);
        await UI.logoutFrom(page);
    })
})