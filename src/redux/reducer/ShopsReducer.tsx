import {ShopsActionTypes} from "../actions/Actions";
import {ShopsActions} from "../actions/ShopsAction";
import {ShopDto} from "../../rest/ShopsService";
import {ReviewRating} from "../../rest/ReviewService";

interface IShopsState {
    shops: Array<ShopDto>,
    ratings: Map<String, ReviewRating>,
    currentPage: number
}

const initialState: IShopsState = {
    shops: [],
    ratings: new Map(),
    currentPage: 0
};

export default function (state: IShopsState = initialState, action: ShopsActions): IShopsState {
    switch (action.type) {
        case ShopsActionTypes.SET_RATINGS_ACTION:
            return {
                ...state,
                ratings: action.payload
            };
        case ShopsActionTypes.SET_SHOPS_ACTION:
            return {
                ...state,
                shops: action.payload
            };
        case ShopsActionTypes.SET_CURRENT_PAGE_ACTION:
            return {
                ...state,
                currentPage: action.payload
            };
        default:
            return state;
    }
}