import { readFile, writeFile } from "fs/promises";
import Ajv from "ajv";
import console from "console";

export abstract class CredentialsHandler {
    protected fileConent;
    protected schema;

    public Ready: Promise<this>;
    public readonly CREDENTIALS_FILE_PATH: string;
    
    constructor(filePath: string, schema: Object){
        this.CREDENTIALS_FILE_PATH = filePath;
        this.schema = schema;
        this.Ready = new Promise(async (makeReady) => {
            try {
                this.fileConent = await this.read();
                this.validate(this.fileConent);
                makeReady(this); 
            } catch (e) {
                console.error(`unable to initilazie CredentialsHandler due to:\n${(e as Error).stack}`);
                process.exit(1);
            }
        })
    }

    protected validate(data: string){
        if (!this.schema){
            throw new Error('JSON Schema is not set for instance');
        }

        const validate = new Ajv()
            .compile(this.schema);
            
        const valid = validate(data);
        if (!valid){
            throw new Error(`JSON schema validation errors:\n${validate.errors}`);
        }
    }

    protected async write(): Promise<void> {
        try{
            return await writeFile(this.CREDENTIALS_FILE_PATH, JSON.stringify(this.fileConent, null, 3)); 
        } catch(e) {
            throw new Error(`unable to write ${this.CREDENTIALS_FILE_PATH} credentials file due to:\n${(e as Error).stack}`);
        }
    }

    protected async read(): Promise<string> {
        try {
            return JSON.parse((await readFile(this.CREDENTIALS_FILE_PATH)).toString());
        } catch (e) {
            throw new Error(`unable to read ${this.CREDENTIALS_FILE_PATH} credentials file due to:\n${(e as Error).stack}`);
        }
    }
}