import { CredentialsHandler } from "./CredentialsHandler";
import { CredentialsStructure, CredentialsStructureSchema, UserCredentials, Environment as EnvironmentStructure } from "./CredentialsStructure";
import { writeFile } from "fs/promises";
import { Environment } from "./Environment";
import { User } from "./User";

export class SfCredentials extends CredentialsHandler {
    fileConent: CredentialsStructure;

    constructor(){
        super("./test/config/credentials.json", CredentialsStructureSchema);
    }

    public async saveCredentialsToFileFor(userCredentials: UserCredentials): Promise<void> {
        if (this.fileConent){
            try {
                this.updatePasswordFor(this.fileConent, userCredentials);
                return await writeFile(this.CREDENTIALS_FILE_PATH, JSON.stringify(this.fileConent, null, 3));
            } catch(e) {
                console.error(`unable to write salesforce credentials file due to:\n${(e as Error).stack}`);
                process.exit(1);
            }
        }
    }

    public userCredentialsFor(environment: Environment, label: User): UserCredentials {
        let matches: number = 0;
        let userCredentials;
        if(this.fileConent){
            this.fileConent.environments
                .forEach(env => {
                    if (env.name === environment){  
                        env.users.forEach(user => {
                            if (user.label === label){
                                userCredentials = user.credentials;
                                matches++;
                            }
                        });
                    }
            });
        }
        if (!userCredentials){
            throw new Error(`cannot find any users labeled ${label} on environment ${environment}`);
        } else if (matches > 1){
            throw new Error(`found ${matches} duplicate usernames labeled ${label} on environment ${environment}`);
        }
        return userCredentials;
    }

    public environmentDataFor(environment: Environment): EnvironmentStructure {
        let matches: number = 0;
        let environmentData: EnvironmentStructure;
        if(this.fileConent){
            this.fileConent.environments
                .forEach(env => {
                    if (env.name === environment){
                        environmentData = env;
                        matches++;
                    }
                });
        }
        if (!environmentData){
            throw new Error(`cannot find any environments named ${environment}`);
        } else if (matches > 1){
            throw new Error(`found ${matches} duplicate environments named ${environment}`);
        }
        return environmentData;
    }

    private updatePasswordFor(target: CredentialsStructure, userCredentials: UserCredentials): CredentialsStructure {
        let matches: number = 0;
        target.environments.forEach((environment) => {
            environment.users.forEach((user) => {
                if (user.credentials.username === userCredentials.username){
                    user.credentials.password = userCredentials.password;
                }
            })
        })
        if (!matches){
            throw new Error(`cannot find username ${userCredentials.username}`);
        }
        return target;
    }
}