import {IBanknote} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface BanknoteState {
    banknotes: IBanknote[];
    banknote: IBanknote | null,
    isLoading: boolean;
    error: string;
    success: string;
    quantity: number;
    // draftID: number;
}

const initialState: BanknoteState = {
    banknotes: [],
    banknote: null,
    isLoading: false,
    error: '',
    success: '',
    quantity: 0,
    // draftID: 0
}

export const banknoteSlice = createSlice({
    name: 'banknote',
    initialState,
    reducers: {
        increase(state) {
            state.quantity += 1
        },
        minus(state) {
            state.quantity = state.quantity == 0 ? 0 :  state.quantity - 1
        },
        reset(state) {
            state.quantity = 0
        },
        banknotesFetching(state) {
            state.isLoading = true
            state.error = ''
            state.success = ''
        },
        banknotesFetched(state, action: PayloadAction<[IBanknote[], number]>) {
            state.isLoading = false
            state.banknotes = action.payload[0]
            // state.draftID = action.payload[1]
        },
        banknotesFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.success = ''
        },
        // setDraft(state, action: PayloadAction<number>) {
        //     state.draftID = action.payload
        // },
        banknoteAddedIntoOperation(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        banknoteFetching(state) {
            state.isLoading = true
            state.error = ''
            state.success = ''
        },
        banknoteFetched(state, action: PayloadAction<IBanknote>) {
            state.isLoading = false
            state.error = ''
            state.banknote = action.payload
        },
        companyFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.banknotes = []
            state.banknote = null
        },
    },
})

export default banknoteSlice.reducer;