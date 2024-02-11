import {IDeleteBanknoteOperation, IOpearation, IRequest} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface OperationState {
    operation: IRequest | null;
    singleOperation: IOpearation | null,
    isLoading: boolean;
    error: string;
    success: string;
}

const initialState: OperationState = {
    operation: null,
    singleOperation: null,
    isLoading: false,
    error: '',
    success: ''
}

export const operationSlice = createSlice({
    name: 'operation',
    initialState,
    reducers: {
        operationsFetching(state) {
            state.isLoading = true
        },
        operationsFetched(state, action: PayloadAction<IRequest>) {
            state.isLoading = false
            state.error = ''
            state.operation = action.payload
        },
        operationFetched(state, action: PayloadAction<IOpearation>) {
            state.isLoading = false
            state.error = ''
            state.singleOperation = action.payload
        },
        operationsDeleteSuccess(state, action: PayloadAction<IDeleteBanknoteOperation>) {
            state.isLoading = false
            const text = action.payload.description ?? ""
            state.error = text
            state.success = "купюра успешна удалена из заявки"
        },
        operationsUpdated(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        operationsDeleteError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
        operationsFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
    },
})

export default operationSlice.reducer;