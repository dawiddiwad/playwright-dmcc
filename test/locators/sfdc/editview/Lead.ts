import { Page } from "@playwright/test";

export class Lead {
    public static readonly FIRST_NAME: string = "//input[@name='firstName']";
    public static readonly LAST_NAME: string = "//input[@name='lastName']";
    public static readonly EMAIL: string = "//input[@name='Email']";
    public static readonly COMPANY: string = "//input[@name='Company']";
    public static readonly COUNTRY_CODE: string = "//input[@name='Country_code__c']";
    public static readonly AREA_CODE: string = "//input[@name='Area_code__c']";
    public static readonly PHONE_NUMBER: string = "//input[@name='Phone_No__c']";
    public static readonly DESCRIPTION: string = "(//textarea[ancestor::div[preceding-sibling::label[text()='Description']]])[1]";

    public static readonly  SAVE_BUTTON: string = "//button[@name='SaveEdit']";

    public static async fillPicklistWithValue(page: Page, picklistLabel: string, picklistValue: string): Promise<void> {
        await page.click(`(//button[ancestor::div[preceding-sibling::label[text()='${picklistLabel}']]])[1]`);
        await page.click(`(//lightning-base-combobox-item[@data-value='${picklistValue}'])[last()]`);
    }
}