import { ShopsActionTypes } from '../actions/Actions';
import { ShopDto } from '../../rest/ShopsService';
import { ReviewRating } from '../../rest/ReviewService';
import { AnyAction } from 'redux';

export interface IShopsState {
    allShops: ShopDto[];
    shops: ShopDto[];
    ratings: Map<String, ReviewRating>;
    currentPage: number;
    shopsLoaded: boolean;
    currentShopUniqueCode: string
}

const initialState: IShopsState = {
    allShops: [],
    shops: [],
    ratings: new Map(),
    currentPage: 0,
    shopsLoaded: false,
    currentShopUniqueCode: ''
};

export default function (
    state: IShopsState = initialState,
    action: AnyAction
): IShopsState {
    switch (action.type) {
        case ShopsActionTypes.SET_RATINGS_ACTION:
            return {
                ...state,
                ratings: action.payload,
            };
        case ShopsActionTypes.SET_SHOPS_ACTION:
            return {
                ...state,
                shops: action.payload,
            };
        case ShopsActionTypes.SET_CURRENT_PAGE_ACTION:
            return {
                ...state,
                currentPage: action.payload,
            };
        case ShopsActionTypes.SHOPS_LOADED:
            return {
                ...state,
                allShops: action.payload,
                shopsLoaded: true,
            };
        case ShopsActionTypes.SET_CURRENT_SHOP:
            return {
                ...state,
                currentShopUniqueCode: action.payload,
            };
        default:
            return state;
    }
}
