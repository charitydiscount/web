import { Product, ProductHistoryScale } from "../../rest/ProductsService";
import { ProductsActionTypes } from "../actions/Actions";
import { ProductActions } from "../actions/ProductsAction";
import {Routes} from "../../components/helper/Routes";

export interface ProductSearch {
    searchTerm: string,
    minPrice: string,
    maxPrice: string,
    sort: string,
    currentPage: number,
    products: Product[],
    total: number
}

export interface IProductState {
    currentProduct: Product,
    productSearch: ProductSearch,
    similarProducts: Product[],
    similarLoading: boolean
    productHistory: ProductHistoryScale[],
    backLink: string,
    historyLoading: boolean
}

const initialState: IProductState = {
    currentProduct: null,
    similarProducts: [],
    productHistory: [],
    historyLoading: true,
    similarLoading: true,
    backLink: Routes.PRODUCTS,
    productSearch: {
        searchTerm: '',
        minPrice: '',
        maxPrice: '',
        sort: '',
        currentPage: 0,
        products: [],
        total: 50
    }
};

export default function (
    state: IProductState = initialState,
    action: ProductActions
): IProductState {
    switch (action.type) {
        case ProductsActionTypes.SET_CURRENT_PRODUCT_ACTION:
            return {
                ...state,
                currentProduct: action.payload
            };
        case ProductsActionTypes.SET_BACK_LINK_ACTION:
            return {
                ...state,
                backLink: action.payload
            };
        case ProductsActionTypes.SET_CURRENT_PRODUCT_HISTORY_ACTION:
            return {
                ...state,
                productHistory: action.payload,
                historyLoading: false
            };

        case ProductsActionTypes.SET_CURRENT_PRODUCT_SIMILAR_ACTION:
            return {
                ...state,
                similarProducts: action.payload,
                similarLoading: false
            };
        case ProductsActionTypes.SET_PRODUCT_HISTORY_LOADING:
            return {
                ...state,
                historyLoading: action.payload
            };
        case ProductsActionTypes.SET_PRODUCT_SIMILAR_LOADING:
            return {
                ...state,
                similarLoading: action.payload
            };
        case ProductsActionTypes.SET_CURRENT_SEARCH_PARAMS:
            return {
                ...state,
                productSearch: action.payload
            };
        case ProductsActionTypes.RESET_SEARCH_PARAMS:
            return {...initialState};
        default:
            return state;
    }
}
