import { CredentialsHandler } from "./CredentialsHandler";
import { CredentialsStructure, CredentialsStructureSchema, UserCredentials, Environment as EnvironmentStructure } from "./structures/SalesforceCredentialsStructure";
import { Environment } from "./structures/Environment";
import { User } from "./structures/User";

export class SalesforceCredentialsHandler extends CredentialsHandler {

    constructor(){
        super("./test/config/SfCredentials.json", CredentialsStructureSchema);
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
            throw new Error(`cannot find salesforce username ${userCredentials.username}`);
        }
        return target;
    }

    public async updateUserCredentialsFor(userCredentials: UserCredentials): Promise<void> {
            try {
                this.content = this.updatePasswordFor(this.content, userCredentials);
                return await this.write();
            } catch(e) {
                console.error(`unable to update salesforce user credentials due to:\n${(e as Error).stack}`);
                process.exit(1);
            }
    }

    public userCredentialsFor(environment: Environment, label: User): UserCredentials {
        let matches: number = 0;
        let userCredentials;
        if(this.content){
            this.content.environments
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
            throw new Error(`cannot find any salesforce users labeled ${label} on environment ${environment}`);
        } else if (matches > 1){
            throw new Error(`found ${matches} duplicate salesforce usernames labeled ${label} on environment ${environment}`);
        }
        return userCredentials;
    }

    public environmentDataFor(environment: Environment): EnvironmentStructure {
        let matches: number = 0;
        let environmentData: EnvironmentStructure;
        if(this.content){
            this.content.environments
                .forEach(env => {
                    if (env.name === environment){
                        environmentData = env;
                        matches++;
                    }
                });
        }
        if (!environmentData){
            throw new Error(`cannot find any salesforce environments named ${environment}`);
        } else if (matches > 1){
            throw new Error(`found ${matches} duplicate salesforce environments named ${environment}`);
        }
        return environmentData;
    }
}