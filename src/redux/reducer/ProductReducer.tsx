import { Product } from "../../rest/ProductsService";
import { ProductsActionTypes } from "../actions/Actions";
import { ProductActions } from "../actions/ProductsAction";

export interface IProductState {
    currentProduct: Product
}

const initialState: IProductState = {
    currentProduct: null
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
        default:
            return state;
    }
}
