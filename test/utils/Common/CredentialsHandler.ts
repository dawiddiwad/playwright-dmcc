import { CredentialsStructure, UserCredentials, Environment as EnvironmentStructure } from "./CredentialsStructure";
import { writeFile, readFile } from "fs/promises";
import { User } from "./User";
import { Environment } from "./Environment";

export class CredentialsHandler {
    private credentialsAll?: CredentialsStructure | null;
    

    public Ready: Promise<CredentialsHandler>;
    public static readonly CREDENTIALS_FILE_PATH: string = "./test/config/credentials.json";
    
    constructor(){
        this.Ready = new Promise(async (ready) => {
            try {
                this.credentialsAll = await this.allCredentials();
                ready(this); 
            } catch (e) {
                console.error(`unable to initilazie CredentialsHandler due to:\n${(e as Error).stack}`);
                process.exit(1);
            }
        })
    }

    private updatePasswordFor(target: CredentialsStructure, userCredentials: UserCredentials): CredentialsStructure {
        let matches: number = 0;
        target.environments.forEach((environment) => {
            environment.users.forEach((user) => {
                if (user.credentials.username === userCredentials.username){
                    user.credentials.password = userCredentials.password;
                    matches++;
                }
            })
        })
        if (!matches){
            throw new Error(`cannot find username ${userCredentials.username}`);
        } else if (matches > 1){
            console.trace(`found ${matches} duplicate usernames for: ${userCredentials.username}`);
        }
        return target;
    }

    public userCredentialsFor(environment: Environment, label: User): UserCredentials {
        let matches: number = 0;
        let userCredentials;
        if(this.credentialsAll){
            this.credentialsAll.environments
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
        if(this.credentialsAll){
            this.credentialsAll.environments
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

    public async allCredentials(): Promise<CredentialsStructure> {
        this.credentialsAll = JSON.parse((await readFile(CredentialsHandler.CREDENTIALS_FILE_PATH)).toString());
        return this.credentialsAll ? this.credentialsAll : Promise.reject();
    }

    public async saveCredentialsToFileFor(userCredentials: UserCredentials): Promise<void> {
        if (this.credentialsAll){
            try {
                this.updatePasswordFor(this.credentialsAll, userCredentials);
                return await writeFile(CredentialsHandler.CREDENTIALS_FILE_PATH, JSON.stringify(this.credentialsAll, null, 3));
            } catch(e) {
                console.error(`unable to write credentials file due to:\n${(e as Error).stack}`);
                process.exit(1);
            }
        }
    }
}