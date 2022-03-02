export interface CredentialsStructure {
    environments: Environment[]
}

export interface Environment {
    name: string,
    orgId: string,
    baseUrl: string,
    users: User[]
}

export interface User {
    label: string,
    credentials: UserCredentials
}

export interface UserCredentials {
    username: string,
    password: string
}
