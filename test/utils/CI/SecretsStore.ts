import { CredentialsHandler } from "../Common/CredentialsHandler";
import { Environment } from "../Common/Environment";
import { User } from "../Common/User";

(async() => {
    const username: string = process.argv[2];
    const password: string = process.argv[3];
    if (!username || !password){
        throw new Error(`missing username or password arguments, this was received:
            username: ${username}
            password: ${password}`);
    }
    await new CredentialsHandler().Ready
        .then(async handle => {
            await handle.saveCredentialsToFileFor({username, password});
            console.log(handle.userCredentialsFor(Environment.PROD, User.SYSADMIN));
    });
})();