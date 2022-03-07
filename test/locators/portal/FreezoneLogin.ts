export class FreezoneLogin {
    public static readonly USERNAME: string = "//*[@id='sfdc_username_container']//input";
    public static readonly PASSWORD: string = "//*[@id='sfdc_password_container']//input";
    public static readonly LOGIN_BUTTON: string = "//button[descendant::*[text()='Log in']]";
}