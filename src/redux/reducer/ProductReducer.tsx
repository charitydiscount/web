import { Product } from "../../rest/ProductsService";
import { ProductsActionTypes } from "../actions/Actions";
import { ProductActions } from "../actions/ProductsAction";

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
    backProduct: boolean
}

const initialState: IProductState = {
    currentProduct: null,
    productSearch: {
        searchTerm: '',
        minPrice: '',
        maxPrice: '',
        sort: '',
        currentPage: 0,
        products: [],
        total: 50
    },
    backProduct: false
};

export default function (
    state: IProductState = initialState,
    action: ProductActions
): IProductState {
    switch (action.type) {
        case ProductsActionTypes.SET_CURRENT_PRODUCT_ACTION:
            return {
                ...state,
                currentProduct: action.payload,
                backProduct: true
            };
        case ProductsActionTypes.SET_CURRENT_SEARCH_PARAMS:
            return {
                ...state,
                productSearch: action.payload,
                backProduct: false
            };
        case ProductsActionTypes.RESET_SEARCH_PARAMS:
            return {...initialState};
        default:
            return state;
    }
}
