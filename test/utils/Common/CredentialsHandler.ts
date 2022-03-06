import { readFile } from "fs/promises";
import Ajv from "ajv";
import console from "console";

export abstract class CredentialsHandler {
    fileConent;
    schema;

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

    private validate(data: string){
        if (!this.schema){
            console.error('file JSON Schema is not set');
        }
        const validate = new Ajv()
            .compile(this.schema);

        const valid = validate(data);
        if (!valid){
            console.error(validate.errors);
            process.exit(1);
        }
    }

    public async read(): Promise<string> {
        const fileContent: string = JSON.parse((await readFile(this.CREDENTIALS_FILE_PATH)).toString());
        return fileContent;
    }
}