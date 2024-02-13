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
        description: "10 рублей. На лицевой стороне изображён мост через Енисей и часовня Параскевы Пятницы, что в Красноярске",
        nominal: 10,
        status: "действует",
        currency: "RUB",
        image_url: "/RIP_frontend/ten.jpg",
    },
    {
        banknote_id: 2,
        description: "50 рублей красуется Санкт-Петербург. Центральное изображение — скульптура у основания одной из Ростральных колонн.",
        nominal: 50,
        status: "действует",
        currency: "RUB",
        image_url: "/RIP_frontend/fifty.jpg",
    },
    {
        banknote_id: 3,
        description: "Основное изображение лицевой стороны - квадрига на портике здания Большого театра. ",
        nominal: 100,
        status: "действует",
        currency: "RUB",
        image_url: "/RIP_frontend/handred.jpg",
    },
    {
        banknote_id: 4,
        description: "Основное изображение лицевой стороны банкноты — Русский мост — вантовый мост в г. Владивостоке, соединяющий остров Русский с материковой частью г. Владивостока.",
        nominal: 2000,
        status: "действует",
        currency: "RUB",
        image_url: "/RIP_frontend/twothouthend.jpg",
    },
    {
        banknote_id: 5,
        description: "На лицевой стороне банкноты изображен памятник Петру Великому (работы М. М. Антокольского) и парусник на фоне морского и речного вокзала, а на обратной — панорама Соловецкого монастыря.",
        nominal: 500,
        status: "действует",
        currency: "RUB",
        image_url: "/RIP_frontend/fivehandred.jpg",
    },
];
