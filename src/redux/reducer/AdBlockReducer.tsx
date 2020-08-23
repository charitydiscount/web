import { AdBlockActionTypes } from '../actions/Actions';
import { AdBlockAction } from "../actions/AdBlockActions";

export interface IAdBlockState {
    isActive: boolean
}

const initialState: IAdBlockState = {
    isActive: false
};

export default function (
    state: IAdBlockState = initialState,
    action: AdBlockAction
): IAdBlockState {
    switch (action.type) {
        case AdBlockActionTypes.SET_AD_BLOCK_ACTIVE:
            return {
                ...state,
                isActive: action.payload,
            };
        default:
            return state;
    }
}
