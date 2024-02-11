import {combineReducers, configureStore} from "@reduxjs/toolkit";
import banknoteReducer from "./reducers/BanknoteSlice.ts"
import operationReducer from "./reducers/OperationSlice.ts"
import userReducer from "./reducers/UserSlice.ts"
import progressReducer from "./reducers/ProgressData.ts";
import searchReducer from "./reducers/SearchSlice.ts"

const rootReducer = combineReducers({
    banknoteReducer,
    operationReducer,
    userReducer,
    progressReducer,
    searchReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']