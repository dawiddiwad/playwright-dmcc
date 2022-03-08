import faker from "@faker-js/faker";
import test from "@playwright/test";
import { ApplicantDetails } from "../locators/portal/ApplicantDetails";
import { BeforeStarting } from "../locators/portal/BeforeStarting";
import { FreezoneLogin } from "../locators/portal/FreezoneLogin";
import { Home } from "../locators/portal/Home";
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
import { SfdcApiCtx } from "../utils/API/sfdc/SfdcApiCtx";
import { Environment } from "../utils/common/credentials/structures/Environment";
import { User } from "../utils/common/credentials/structures/User";
import { SfdcUiCtx } from "../utils/UI/SfdcUiCtx";

test.describe('DMCC demo - E2E flow', () => {
    let mailer: FreezoneMailer;
    let UI: SfdcUiCtx;
    let API: SfdcApiCtx;

    test.describe.configure({ mode: 'serial' });

    test.beforeAll(async () => {
        mailer = await new FreezoneMailer().Ready;
        UI = await new SfdcUiCtx(Environment.QA, User.SYSADMIN).Ready;
        API = await new SfdcApiCtx(Environment.QA, User.SYSADMIN).Ready;
    })

    test('Create and Convert Lead', async ({page}) => {test.slow();
        await test.step('login to SFDC', async () => {
            await UI.loginOn(page);
        });

        await test.step('Navigate to Leads listview', async () => {
            await page.click(NavigationBar.APP_LAUNCHER);
            await page.fill(NavigationBar.APP_LAUNCHER_SEARCH_FIELD, "Leads");
            await page.click(NavigationBar.getAppLauncherSearchResultsItemByLabel("Leads"));
        });

        await test.step('Create new Lead', async () => {
            await page.click(ListView.NEW_BUTTON);
            await page.click(Modal.NEXT_BUTTON);
            await Lead.fillPicklistWithValue(page, "Lead Source", "Web");
            await Lead.fillPicklistWithValue(page, "Origin Country", "Afghanistan");
            await Lead.fillPicklistWithValue(page, "Company Type", "New Company");
            await Lead.fillPicklistWithValue(page, "Activity Type", "Service");
            await Lead.fillPicklistWithValue(page, "Company Setup", "Immediately");
            await Lead.fillPicklistWithValue(page, "How did you hear about us (1)", "Advertising / News / Editorial");
            await Lead.fillPicklistWithValue(page, "How did you hear about us (2)", "Email Advertising");
            await Lead.fillPicklistWithValue(page, "Address Country", "Afghanistan");
            await page.fill(Lead.FIRST_NAME, faker.name.firstName());
            await page.fill(Lead.LAST_NAME, faker.name.lastName());
            await page.fill(Lead.EMAIL, "dmccinboxqa@gmail.com");
            await page.fill(Lead.COMPANY, faker.company.companyName());
            await page.fill(Lead.COUNTRY_CODE, faker.datatype.number(100).toString());
            await page.fill(Lead.AREA_CODE, faker.datatype.number(100).toString());
            await page.fill(Lead.PHONE_NUMBER, faker.phone.phoneNumber('###-###-###'));
            await page.fill(Lead.DESCRIPTION, "QA automation");
            await page.click(Lead.SAVE_BUTTON);
        });

        await test.step('Convert Lead', async () => {
            await page.click(HighlightsPanel.CONVERT_BUTTON);
            await page.click(LeadConvert.CONVERT_BUTTON, {delay: 2000});
            await page.click(LeadConvert.OPPORTUNITY_LINK);
        });

        await test.step('Edit Opportunity', async () => {
            await page.click(HighlightsPanel.EDIT_BUTTON);
            await Opportunity.selectItemOnLookup(page, "SR Template", "201-New Company Application L2L");
            await page.fill(Opportunity.LEAD_EMAIL, "dmccinboxqa@gmail.com");
            await page.click(Opportunity.SAVE_BUTTON);
        });

        await test.step(`Save Opportunity as a 'Convincing Customer'`, async () => {
            await page.click(StagesPath.CHANGE_CLOSED_STAGE_BUTTON);
            await StagesPath.fillPicklistWithValue(page, "StageName", "Convincing Customer");
            await page.click(StagesPath.DONE_BUTTON);
            await page.waitForLoadState('networkidle');
        });

        await test.step('logout from SFDC', async () => {
            await UI.logoutFrom(page);
        });
    });

    test('Portal flow until 1st payemnt', async ({page}) => {test.slow();
        let username;
        await test.step('Signup Password', async () => {
            await page.goto(await mailer.latestSignupLink(), {waitUntil: 'networkidle'});
            await page.fill(Signup.PASSWORD, Signup.commonPassword());
            await page.fill(Signup.PASSWORD_CONFIRM, Signup.commonPassword());
            await page.click(Signup.SIGNUP_BUTTON);
        });
        await test.step('Singup OTP', async () => {
            await Signup.enterOTP(page, await mailer.latestSignupCode());
            await page.click(Signup.CONTINUE_BUTTON);
            username = FreezoneLogin.registeredUsernameFrom(await page.textContent(FreezoneLogin.USERNAME_BOX));
            await page.click(Signup.GO_TO_LOGIN_BUTTON);
        });
        await test.step('Login to Portal', async () => {
            await page.fill(FreezoneLogin.USERNAME, username);
            await page.fill(FreezoneLogin.PASSWORD, Signup.commonPassword());
            await page.click(FreezoneLogin.LOGIN_BUTTON);
        });
        await test.step('Before Starting page', async () => {
            await page.click(Home.CONTINUE_APPLICATION_BUTTON);
            await page.click(BeforeStarting.TERMS_AND_CONDITIONS_LINK);
            await page.click(BeforeStarting.TERMS_AND_CONDITIONS_ACCEPT_BUTTON);
            await page.click(BeforeStarting.CONTINUE_BUTTON);
        });
        await test.step('Applicant Details', async () => {
            await page.click(ApplicantDetails.CONSULTANT_OPTION_BUTTON);
            await page.setInputFiles(ApplicantDetails.UPLOAD_LETTER_INPUT, './test/uploads/elephant.jpg');
            await page.click(ApplicantDetails.UPLOAD_DONE_BUTTON);
            await page.setInputFiles(ApplicantDetails.UPLOAD_PASSPORT_INPUT, './test/uploads/elephant.jpg');
            await page.click(ApplicantDetails.UPLOAD_DONE_BUTTON);
        });
        await test.step('TBC...', async () => {
            await page.waitForLoadState('networkidle');
        });
    });
});