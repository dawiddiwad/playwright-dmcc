import { FreezoneMailer } from "./test/utils/API/gmail/FreezoneMailer";
import { MissingGmailMessageError } from "./test/utils/API/gmail/GmailCtx";

(async () => {
    const freezoneMailer = await new FreezoneMailer().Ready;
    try {
        console.log(await freezoneMailer.latestSignupLink());
        console.log(await freezoneMailer.latestSignupCode());
    } catch (e) {
        if (e instanceof MissingGmailMessageError){
            console.log("no messages yet...");
        } else {
            throw e;
        }
    }
})();