export interface CredentialsStructure {
    environments: Environment[]
}

interface Environment {
    name: string,
    orgId: string,
    baseUrl: string,
    users: User[]
}

interface User {
    label: string,
    credentials: UserCredentials
}

export interface UserCredentials {
    username: string,
    password: string
}
