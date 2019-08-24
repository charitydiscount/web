import {ShopsActionTypes} from "../actions/Actions";
import {ShopsActions} from "../actions/ShopsAction";
import {ShopDto} from "../../rest/ShopsService";

interface IShopsState {
    shops: Array<ShopDto>,
    currentPage: number
}

const initialState: IShopsState = {
    shops: [],
    currentPage: 0
};

export default function (state: IShopsState = initialState, action: ShopsActions): IShopsState {
    switch (action.type) {
        case ShopsActionTypes.SET_SHOPS_ACTION:
            return {
                ...state,
                shops: action.payload
            };
        case ShopsActionTypes.SET_CURRENT_PAGE_ACTION:
            return{
                ...state,
                currentPage: action.payload
            };
        case ShopsActionTypes.RESET_SHOPS_ACTION:
            return initialState;
        default:
            return state;
    }
}