import faker from "@faker-js/faker";
import test from "@playwright/test";
import { Signup } from "../locators/portal/Signup";
import { Lead } from "../locators/sfdc/editview/Lead";
import { Opportunity } from "../locators/sfdc/editview/Opportunity";
import { HighlightsPanel } from "../locators/sfdc/HighlightsPanel";
import { LeadConvert } from "../locators/sfdc/LeadConvert";
import { ListView } from "../locators/sfdc/ListView";
import { Modal } from "../locators/sfdc/Modal";
import { NavigationBar } from "../locators/sfdc/NavigationBar";
import { StagesPath } from "../locators/sfdc/StagesPath";
import { FreezoneMailer } from "../utils/API/gmail/FreezoneMailer";
import { Environment } from "../utils/common/credentials/structures/Environment";
import { User } from "../utils/common/credentials/structures/User";
import { SfdcUiCtx } from "../utils/UI/SfdcUiCtx";

test.describe('DMCC demo', () => {
    test('Lead to Signup link path', async ({page}) => {
        test.slow();
        const mailer = await new FreezoneMailer().Ready;
        //Authenticate SFDC sandbox
        const UI: SfdcUiCtx = await new SfdcUiCtx(Environment.QA, User.SYSADMIN).Ready;
        await UI.loginOn(page);

        //Navigate to Leads listview
        await page.click(NavigationBar.APP_LAUNCHER);
        await page.fill(NavigationBar.APP_LAUNCHER_SEARCH_FIELD, "Leads");
        await page.click(NavigationBar.getAppLauncherSearchResultsItemByLabel("Leads"));

        //Create new Lead
        await page.click(ListView.NEW_BUTTON);
        await page.click(Modal.NEXT_BUTTON);

        //Handle picklists
        await Lead.fillPicklistWithValue(page, "Lead Source", "Web");
        await Lead.fillPicklistWithValue(page, "Origin Country", "Afghanistan");
        await Lead.fillPicklistWithValue(page, "Company Type", "New Company");
        await Lead.fillPicklistWithValue(page, "Activity Type", "Service");
        await Lead.fillPicklistWithValue(page, "Company Setup", "Immediately");
        await Lead.fillPicklistWithValue(page, "How did you hear about us (1)", "Advertising / News / Editorial");
        await Lead.fillPicklistWithValue(page, "How did you hear about us (2)", "Email Advertising");
        await Lead.fillPicklistWithValue(page, "Address Country", "Afghanistan");

        //Fill out rest of mandatory fields and save Lead
        await page.fill(Lead.FIRST_NAME, faker.name.firstName());
        await page.fill(Lead.LAST_NAME, faker.name.lastName());
        await page.fill(Lead.EMAIL, "dmccinboxqa@gmail.com");
        await page.fill(Lead.COMPANY, faker.company.companyName());
        await page.fill(Lead.COUNTRY_CODE, faker.datatype.number(100).toString());
        await page.fill(Lead.AREA_CODE, faker.datatype.number(100).toString());
        await page.fill(Lead.PHONE_NUMBER, faker.phone.phoneNumber());
        await page.fill(Lead.DESCRIPTION, "QA automation");
        await page.click(Lead.SAVE_BUTTON);

        //Convert Lead
        await page.click(HighlightsPanel.CONVERT_BUTTON);
        await page.click(LeadConvert.CONVERT_BUTTON, {delay: 2000});
        await page.click(LeadConvert.OPPORTUNITY_LINK);

        //Edit Opportunity
        await page.click(HighlightsPanel.EDIT_BUTTON);
        await Opportunity.selectItemOnLookup(page, "SR Template", "201-New Company Application L2L");
        await page.fill(Opportunity.LEAD_EMAIL, "dmccinboxqa@gmail.com");
        await page.click(Opportunity.SAVE_BUTTON);

        //Save Opportunity as a 'Convincing Customer'
        await page.click(StagesPath.CHANGE_CLOSED_STAGE_BUTTON);
        await StagesPath.fillPicklistWithValue(page, "StageName", "Convincing Customer");
        await page.click(StagesPath.DONE_BUTTON);

        //Signup Password
        await page.goto(await mailer.latestSignupLink());
        await page.fill(Signup.PASSWORD, Signup.commonPassword());
        await page.fill(Signup.PASSWORD_CONFIRM, Signup.commonPassword());
        await page.waitForLoadState('networkidle');
        await page.click(Signup.SIGNUP_BUTTON);

        //Singup OTP
        await Signup.enterOTP(page, await mailer.latestSignupCode());
        await page.click(Signup.CONTINUE_BUTTON);
        await page.click(Signup.GO_TO_LOGIN_BUTTON);

        //finalize
        await page.waitForLoadState('networkidle');
    })
})