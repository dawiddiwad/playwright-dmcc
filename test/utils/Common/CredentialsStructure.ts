import { JTDSchemaType } from "ajv/dist/core"

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

export const CredentialsStructureSchema = {
    "type": "object",
    "properties": {
      "environments": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "orgId": {
                "type": "string"
              },
              "baseUrl": {
                "type": "string"
              },
              "users": {
                "type": "array",
                "items": [
                  {
                    "type": "object",
                    "properties": {
                      "label": {
                        "type": "string"
                      },
                      "credentials": {
                        "type": "object",
                        "properties": {
                          "username": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "username"
                        ]
                      }
                    },
                    "required": [
                      "label",
                      "credentials"
                    ]
                  },
                  {
                    "type": "object",
                    "properties": {
                      "label": {
                        "type": "string"
                      },
                      "credentials": {
                        "type": "object",
                        "properties": {
                          "username": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "username"
                        ]
                      }
                    },
                    "required": [
                      "label",
                      "credentials"
                    ]
                  }
                ]
              }
            },
            "required": [
              "name",
              "orgId",
              "baseUrl",
              "users"
            ]
          }
        ]
      }
    },
    "required": [
      "environments"
    ]
  }