import { createAction } from "../helper/ActionHelper";
import { ProductsActionTypes } from "./Actions";
import { Product } from "../../rest/ProductsService";
import { ActionTypesUnion } from "../helper/TypesHelper";
import { ProductSearch } from "../reducer/ProductReducer";

export const ProductActions = {
    setCurrentProduct: (currentProduct: Product) => createAction(ProductsActionTypes.SET_CURRENT_PRODUCT_ACTION, currentProduct),
    setProductSearch: (productSearch: ProductSearch) => createAction(ProductsActionTypes.SET_CURRENT_SEARCH_PARAMS, productSearch),
    resetSearchParams: () => createAction(ProductsActionTypes.RESET_SEARCH_PARAMS)
};

export type ProductActions = ActionTypesUnion<typeof ProductActions>