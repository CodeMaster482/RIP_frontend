export interface IBanknotesResponse {
    banknotes: IBanknotesResponseBanknotes,
    status: string,
}

export interface IBanknotesResponseBanknotes {
    draft_id: number,
    banknotes_list: IBanknote[],
}

export interface IBanknotesResponseBanknote {
    banknote: IBanknote,
    status: string,
}

export interface IBanknoteResponse {
    banknote: IBanknote,
    status: string
}

export interface IStatus {
    id: number,
    status_name: string,
}

export interface IBanknote {
    banknote_id: number,
    description: string,
    nominal: number,
    currency: string,
    status: string,
    image_url?: string, 
    // company_id: number,
    // description: string,
    // name: string,
    // status: string,
    // iin?: string,
    // image_url?: string,
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
