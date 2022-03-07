import { GmailCtx } from "./test/utils/API/gmail/GmailApi";

(async () => {
    const gmail = await new GmailCtx().Ready;
    console.log(await gmail.readMessageById("17f557acf733cacc"));
    await gmail.readMessagesByQuery("label:dmcc-signup-code");
})();