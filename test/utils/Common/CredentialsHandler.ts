import { CredentialsStructure, UserCredentials } from "./CredentialsStructure";
import { writeFile, readFile } from "fs/promises";

class UsernamePasswordFetcher {
    private credentials: UserCredentials;
    public static readonly CREDENTIALS_FILE_PATH: string = "./test/config/credentials.json";
    
    constructor(credentials: UserCredentials){
        this.credentials = credentials;
    }

    private sweepForUsernamesIn(credentials: CredentialsStructure): CredentialsStructure {
        let matches: number = 0;
        credentials.environments.forEach((environment) => {
            environment.users.forEach((user) => {
                if (user.credentials.username === this.credentials.username){
                    user.credentials.password = this.credentials.password;
                    matches++;
                }
            })
        })
        if (!matches){
            throw new Error(`cannot find username ${this.credentials.username}`);
        } else if (matches > 1){
            console.trace(`duplicate usernames found for: ${this.credentials.username}`);
        }
        return credentials;
    }

    public static async savedCredentials(): Promise<CredentialsStructure> {
        return <any> JSON.parse((await readFile(this.CREDENTIALS_FILE_PATH)).toString());
    }

    public async wrtiePasswordsToFile(): Promise<void> {
        try {
            let storedCreds: CredentialsStructure = await UsernamePasswordFetcher.savedCredentials();
            storedCreds = this.sweepForUsernamesIn(storedCreds);
            return await writeFile(UsernamePasswordFetcher.CREDENTIALS_FILE_PATH, JSON.stringify(storedCreds, null, 3));
        } catch(e){
            console.error("unable to write credentials file");
            console.trace(e);
            process.exit(1);
        }
    }
}

(async() => {
    const username: string = process.argv[2];
    const password: string = process.argv[3];
    if (!username || !password){
        throw new Error(`missing username or password arguments, this was received:
            username: ${username}
            password: ${password}`);
    }
    await new UsernamePasswordFetcher({username, password}).wrtiePasswordsToFile();
})();