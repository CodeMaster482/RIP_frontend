import {AppDispatch} from "../store.ts";
import axios from "axios";
import {
    IAuthResponse,
    IBanknoteResponse,
    IBanknoteWithDraft,
    IDeleteBanknoteOperation,
    IOperationResponse, IRegisterResponse,
    IRequest,
    IOpearation,
    mockBanknotes, IDefaultResponse
} from "../../models/models.ts";
import Cookies from 'js-cookie';
import {banknoteSlice} from "./BanknoteSlice.ts";
import {operationSlice} from "./OperationSlice.ts";
import {userSlice} from "./UserSlice.ts";

// ----------- BanknoteItem -----------------

// BanknoteList BanknoteTable
export const fetchBanknotes = (searchValue?: string, makeLoading: boolean = true) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    const config = {
        method: "get",
        url: '/api/banknote' + `?banknote_name=${searchValue ?? ''}`,
        headers: {
            Authorization: `Bearer ${accessToken ?? ''}`,
        },
    };

    try {
        if (makeLoading) {
            dispatch(banknoteSlice.actions.banknotesFetching());
        }
        const response = await axios<IBanknoteWithDraft>(config);
        const draftId = response.data.draft_id;
        dispatch(banknoteSlice.actions.banknotesFetched([response.data.banknotes, draftId]));

        return draftId;
    } catch (e) {
        dispatch(banknoteSlice.actions.banknotesFetched([filterMockData(searchValue), 0]));
        return null;
    }
};

export const addBanknoteIntoOperation = (banknoteId: number, quantity: number, banknoteName: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "post",
        url: "/api/banknotes/request",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            banknote_id: banknoteId,
            quantity: quantity
        }
    }

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? "";
        const successText = errorText || `Купюра "${banknoteName}" добавлена`;

        dispatch(banknoteSlice.actions.banknoteAddedIntoOperation([errorText, successText]));

    } catch (e) {
        dispatch(banknoteSlice.actions.banknotesFetchedError(`${e}`));
        return null; // Возвращаем null в случае ошибки
    }
}

// ----------------- BanknoteDetail --------------------

export const fetchBanknote = (
    banknoteId: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    try {
        dispatch(banknoteSlice.actions.banknotesFetching())
        const response = await axios.get<IBanknoteResponse>(`/api/banknotes/${banknoteId}`)
        const banknote = response.data.banknote
        setPage(banknote.nominal.toString() ?? "Без номинала", banknote.banknote_id)
        dispatch(banknoteSlice.actions.banknoteFetched(banknote))
    } catch (e) {
        console.log(`Ошибка загрузки купюр: ${e}`)
        const previewID = banknoteId !== undefined ? parseInt(banknoteId, 10) - 1 : 0;
        const mockBanknote = mockBanknotes[previewID]
        setPage(mockBanknote.nominal.toString() ?? "Без номинала", mockBanknote.banknote_id)
        dispatch(banknoteSlice.actions.banknoteFetched(mockBanknote))
    }
}

// ------------- BanknoteTableCell ---------------

export const deleteBanknote = (banknoteId: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));

    const config = {
        method: "delete",
        url: `/api/banknotes`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: `${banknoteId}`
        },
    }

    try {
        dispatch(banknoteSlice.actions.banknotesFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Купюра удалена' : ''
        dispatch(banknoteSlice.actions.banknoteAddedIntoOperation([error, success]))
        dispatch(fetchBanknotes())
    } catch (e) {
        dispatch(banknoteSlice.actions.banknotesFetchedError(`Ошибка: ${e}`))
    }
}

export const updateBanknoteImage = (cityId: number, file: File) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('banknote_id', `${cityId}`);

    const config = {
        method: "put",
        url: `/api/banknotes/upload-image`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: formData,
    }

    try {
        dispatch(banknoteSlice.actions.banknotesFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Фото обновленно' : ''
        dispatch(banknoteSlice.actions.banknoteAddedIntoOperation([error, success]))
        dispatch(fetchBanknotes())
    } catch (e) {
        dispatch(banknoteSlice.actions.banknotesFetchedError(`Ошибка: ${e}`))
    }
}

export const updateBanknoteInfo = (
    id: number,
    banknoteName: string,
    description: string,
    status: string,
    Currency: string
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    const config = {
        method: "put",
        url: `/api/banknotes`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            banknote_id: id,
            name: banknoteName,
            description: description,
            status: status,
            currency: Currency,
        },
    }

    try {
        dispatch(banknoteSlice.actions.banknotesFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Данные обновленны' : ''
        dispatch(banknoteSlice.actions.banknoteAddedIntoOperation([error, success]))
        dispatch(fetchBanknotes())
    } catch (e) {
        dispatch(banknoteSlice.actions.banknotesFetchedError(`Ошибка: ${e}`))
    }
}

// ------------------- LoginPage ---------------------

export const loginSession = (login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/user/signIn",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IAuthResponse>(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || ""
        dispatch(userSlice.actions.setStatuses([errorText, successText]));
        const jwtToken = response.data.access_token
        dispatch(userSlice.actions.setRole(response.data.role ?? ''))
        if (jwtToken) {
            Cookies.set('jwtToken', jwtToken);
            Cookies.set('role', response.data.role ?? '');
            dispatch(userSlice.actions.setAuthStatus(true));
            Cookies.set('userName', response.data.userName)
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000);
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

// ----------------- Navigation Bar ---------------------

export const logoutSession = (jwtToken: string) => async (dispatch: AppDispatch) => {
    //const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "post",
        url: "/api/user/logout",
        headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios(config);
        const errorText = response.data.login == '' ? 'Ошибка при попытке выйти' : ''
            const successText = errorText || "До свидания!"
        dispatch(userSlice.actions.setStatuses([errorText, successText]))

        if (errorText == '') {
            Cookies.remove('jwtToken');
            dispatch(userSlice.actions.setAuthStatus(false))
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000)
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

// ------------------ Register Page ------------------------

export const registerSession = (userName: string, login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/user/signUp",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            user_name: userName,
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IRegisterResponse>(config);
        const errorText = response.data.login == '' ? 'Ошибка регистрации' : ''
        const successText = errorText || "Регистрация прошла успешно"
        dispatch(userSlice.actions.setStatuses([errorText, successText]))
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000)
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

// ----------------- Operation Card -------------------

export const deleteOperation = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "delete",
        url: "/api/operations",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: id
        }
    }
    try {
        dispatch(operationSlice.actions.operationsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка удалена`
        //dispatch(companySlice.actions.setDraft(0))
        dispatch(operationSlice.actions.operationsUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchOperations())
        }
        setTimeout(() => {
            dispatch(operationSlice.actions.operationsUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(operationSlice.actions.operationsDeleteError(`${e}`))
    }
}

export const fetchOperationById = (
    id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    interface ISingleOperationResponse {
        operation: IOpearation,
    }

    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(operationSlice.actions.operationsFetching())
        const response = await axios.get<ISingleOperationResponse>(`/api/operations/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response.data)
        setPage(response.data.operation.operation_name, response.data.operation.id)
        dispatch(operationSlice.actions.operationFetched(response.data.operation))
    } catch (e) {
        dispatch(operationSlice.actions.operationsFetchedError(`${e}`))
    }
}

export const fetchOperations = () => async (dispatch: AppDispatch) => {
    console.log("I am here 2")
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(operationSlice.actions.operationsFetching())
        const response = await axios.get<IOperationResponse>(`/api/operations`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            operations: response.data.operations,
            status: response.data.status
        };

        dispatch(operationSlice.actions.operationsFetched(transformedResponse))
    } catch (e) {
        dispatch(operationSlice.actions.operationsFetchedError(`${e}`))
    }
}

export const makeOperation = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        //url: "/api/operations/form",
        url: "/api/operations/user-form-start",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            requestId:id,
            Server_Token:"qwerty",
            status:"сформирован",
        }
    }
    try {
        dispatch(operationSlice.actions.operationsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка создана`
        dispatch(operationSlice.actions.operationsUpdated([errorText, successText]));
        //dispatch(companySlice.actions.setDraft(0))
        if (successText != "") {
            dispatch(fetchOperations())
        }
        setTimeout(() => {
            dispatch(operationSlice.actions.operationsUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(operationSlice.actions.operationsDeleteError(`${e}`))
    }
}

export const updateOperation = (
    id: number,
    //description: string,
    operationName: string,
    // startDate: string,
    // endDate: string,
    //leader: string
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "put",
        url: "/api/operations",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: "application/json"
        },
        data: {
            //description: description,
            operation_name: operationName,
            // creation_date: convertInputFormatToServerDate(startDate),
            // completion_date: convertInputFormatToServerDate(endDate),
            id: id,
        }
    };

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(operationSlice.actions.operationsUpdated([errorText, successText]));
        setTimeout(() => {
            dispatch(operationSlice.actions.operationsUpdated(['', '']));
        }, 5000);
        dispatch(fetchOperations())
    } catch (e) {
        dispatch(operationSlice.actions.operationsFetchedError(`${e}`));
    }
}

// ------------------- Request View --------------------

export const fetchOperationsFilter = (dateStart?: string, dateEnd?: string, status?: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(operationSlice.actions.operationsFetching())
        const queryParams: Record<string, string | undefined> = {};
        if (dateStart) {
            queryParams.start_date = dateStart;
        }
        if (dateEnd) {
            queryParams.end_date = dateEnd;
        }
        if (status) {
            queryParams.status_id = status;
        }
        const queryString = Object.keys(queryParams)
            .map((key) => `${key}=${encodeURIComponent(queryParams[key]!)}`)
            .join('&');
        const urlWithParams = `/api/operations${queryString ? `?${queryString}` : ''}`;
        const response = await axios.get<IOperationResponse>(urlWithParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            operations: response.data.operations,
            status: response.data.status
        };
        // console.log(transformedResponse.hikes)
        dispatch(operationSlice.actions.operationsFetched(transformedResponse))
    } catch (e) {
        dispatch(operationSlice.actions.operationsFetchedError(`${e}`))
    }
}

export const moderatorUpdateStatus = (operationId: number, status: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: "/api/operations/updateStatus",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            status: status,
            operation_id: operationId
        }
    }
    try {
        dispatch(operationSlice.actions.operationsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Ответ принят`
        dispatch(operationSlice.actions.operationsUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchOperations())
        }
        setTimeout(() => {
            dispatch(operationSlice.actions.operationsUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(operationSlice.actions.operationsDeleteError(`${e}`))
    }
}

// ------------------ Add Banknote ----------------

export const createBanknote = (
    banknoteNominal?: string,
    description?: string,
    currency?: string,
    image?: File | null
) => async (dispatch: AppDispatch) => {
    const formData = new FormData();
    if (banknoteNominal) {
        formData.append('nominal', banknoteNominal);
    }
    if (description) {
        formData.append('description', description);
    }
    if (image) {
        formData.append('image_url', image);
    }
    if (currency) {
        formData.append('currency', currency)
    }
    formData.append('status', 'действует');
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "post",
        url: "/api/banknotes",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    };

    try {
        dispatch(banknoteSlice.actions.banknotesFetching())
        const response = await axios(config);
        const errorText = response.data.description || ''
        const successText = errorText == '' ? "Купюра создан" : ''
        
        dispatch(banknoteSlice.actions.banknoteAddedIntoOperation([errorText, successText]))
        setTimeout(() => {
            dispatch(banknoteSlice.actions.banknoteAddedIntoOperation(['', '']));
        }, 6000)
    } catch (e) {
        dispatch(banknoteSlice.actions.banknotesFetchedError(`${e}`));
    }
}

// ------------------ Table View -------------------

export const deleteOperationById = (
    id: number,
    operation_id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(operationSlice.actions.operationsFetching())
        const response = await axios.delete<IDeleteBanknoteOperation>(`/api/operation-request-banknote`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                id: id,
            },
        });
        dispatch(operationSlice.actions.operationsDeleteSuccess(response.data))
        dispatch(fetchOperationById(operation_id, setPage))
    } catch (e) {
        dispatch(operationSlice.actions.operationsFetchedError(`${e}`))
    }
}

export const updateOperationBanknote = (
    index: number,
    newQuantity: number,
    operation_id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "put",
        url: "/api/operation-request-banknote",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: "application/json"
        },
        data: {
            //description: description,
            quantity: newQuantity,
            // creation_date: convertInputFormatToServerDate(startDate),
            // completion_date: convertInputFormatToServerDate(endDate),
            id: index,
        }
    };

    try {
        const response = await axios(config);
        //const errorText = response.data.description ?? ""
        //const successText = errorText || "Успешно обновленно"
        //dispatch(operationSlice.actions.operationsUpdated([errorText, successText]));
        //dispatch(operationSlice.actions.operationsDeleteSuccess(response.data))
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(operationSlice.actions.operationsUpdated([errorText, successText]));
        setTimeout(() => {
            dispatch(operationSlice.actions.operationsUpdated(['', '']));
        }, 5000);
        dispatch(fetchOperationById(operation_id, setPage))
    } catch (e) {
        dispatch(operationSlice.actions.operationsFetchedError(`${e}`))
    }
}

// ----------------- Mock ----------------
function filterMockData(searchValue?: string) {
    if (searchValue) {
        const filteredCities = mockBanknotes.filter(banknote =>
            banknote.nominal.toString()?.toLowerCase().includes((searchValue ?? '').toLowerCase())
        );
        if (filteredCities.length === 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.getElementById('search-text-field').value = ""
            alert("Данных нету")

        }
        return filteredCities
    }
    return mockBanknotes
}

// --------- Utils -----------

export function DateFormat(dateString: string) {
    if (dateString == "0001-01-01T00:00:00Z") {
        return "Дата не указана"
    }
    const date = new Date(dateString);
    return `${date.getDate()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`
}

export function emptyString(text: string, emptyText: string) {
    return text == "" ? emptyText : text
}

