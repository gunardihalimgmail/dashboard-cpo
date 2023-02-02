import { ActionTypes } from "../action-types";

const initialState = 0;

interface DepositAction {
    type:ActionTypes.DEPOSIT,
    payload:number
}
interface WithdrawAction {
    type:ActionTypes.WITHDRAW,
    payload:number
}
interface BankruptAction {
    type:ActionTypes.BANKRUPT
}

export type Action = DepositAction | WithdrawAction | BankruptAction;

// const bankReducer = (state: number = initialState, action: Action) => {
const bankReducer = (state = initialState, action: Action) => {
    switch(action.type){
        case ActionTypes.DEPOSIT:
            return state + action.payload;
        case ActionTypes.WITHDRAW:
            return state - action.payload;
        case ActionTypes.BANKRUPT:
            return 0;
        default:
            return state;
    }
}

export default bankReducer