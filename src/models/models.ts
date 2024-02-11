export interface IBanknotes {
    cities: IBanknote[],
    status: string
}
export interface IBanknoteResponse {
    banknote: IBanknote,
    status: string
}

export interface IBanknote {
    banknote_id: number,
    description: string,
    nominal: number,
    status: string,
    currency?: string,
    image_url?: string,
}

export interface IBanknoteWithDraft {
    draft_id: number,
    banknotes: IBanknote[],
}

export interface IDefaultResponse {
    description?: string
}

export interface IBanknoteOperations {
    id: number,
    banknote_id: number,
    operation_id: number,
    quantity: number,
    banknote: IBanknote,
}

export interface IRegisterResponse {
    login: string
    password: string
}

export interface IAuthResponse {
    access_token?: string,
    description?: string,
    status?: string,
    role?: string
    userName: string,
    userImage: string
}

export interface UserInfo {
    name: string,
    image: string,
}

export interface IUser {
    id: number,
    name: string,
    login: string,
    password: string,
}

export interface IOpearation {
    id: number,
    operation_name: string,
    creation_date: string,
    completion_date: string,
    formation_date: string,
    //user_id: number,
    status: string,
    status_check: string,
    user_name: string,
    moderator_name: string,
    user_login: string,
    moderator_login: string,
    //creator_login: string,
    //user: IUser,
    //moderator: IUser
    banknote_operation: IBanknoteOperations[],
}

export interface IRequest {
    operations: IOpearation[]
    status: string
}

export interface IOperationResponse {
    operations: IOpearation[]
    status: string
}

export interface IDeleteBanknoteOperation {
    deleted_banknote_operation: number,
    status: string,
    description?: string,
}

export const mockBanknotes: IBanknote[] = [
    {
        banknote_id: 1,
        description: "",
        nominal: 10,
        status: "действует",
        currency: "RUB",
        image_url: " /RIP_Frontend/ten.jpg",
    },
    {
        banknote_id: 2,
        description: "",
        nominal: 50,
        status: "действует",
        currency: "RUB",
        image_url: " /RIP_Frontend/fifty.jpg",
    },
    {
        banknote_id: 3,
        description: "",
        nominal: 100,
        status: "действует",
        currency: "RUB",
        image_url: " /RIP_Frontend/handred.jpg",
    },
    {
        banknote_id: 4,
        description: "",
        nominal: 2000,
        status: "действует",
        currency: "RUB",
        image_url: " /RIP_Frontend/twothouthend.jpg",
    },
    {
        banknote_id: 5,
        description: "",
        nominal: 500,
        status: "действует",
        currency: "RUB",
        image_url: " /RIP_Frontend/fivehandred.jpg",
    },
];
