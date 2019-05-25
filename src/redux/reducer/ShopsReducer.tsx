import {ShopsActionTypes} from "../actions/Actions";
import {ShopDto} from "../../components/products/ShopDto";
import {ShopsActions} from "../actions/ShopsAction";

interface IShopsState {
    shops: Array<ShopDto>
}

const initialState: IShopsState = {
    shops: []
};

export default function (state: IShopsState = initialState, action: ShopsActions): IShopsState {
    switch (action.type) {
        case ShopsActionTypes.SET_SHOPS_ACTION:
            return {
                ...state,
                shops: action.payload
            };
        case ShopsActionTypes.RESET_SHOPS_ACTION:
            return initialState;
        default:
            return state;
    }
}