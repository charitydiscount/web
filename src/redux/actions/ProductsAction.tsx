import { createAction } from "../helper/ActionHelper";
import { ProductsActionTypes } from "./Actions";
import { getProductPriceHistory, getSimilarProducts, Product, ProductHistoryScale } from "../../rest/ProductsService";
import { ActionTypesUnion } from "../helper/TypesHelper";
import { ProductSearch } from "../reducer/ProductReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

export const ProductActions = {
    setCurrentProduct: (currentProduct: Product) => createAction(ProductsActionTypes.SET_CURRENT_PRODUCT_ACTION, currentProduct),
    setCurrentProductHistory: (productHistory: ProductHistoryScale[]) => createAction(ProductsActionTypes.SET_CURRENT_PRODUCT_HISTORY_ACTION, productHistory),
    setHistoryLoading: (historyLoading: boolean) => createAction(ProductsActionTypes.SET_PRODUCT_HISTORY_LOADING, historyLoading),
    setSimilarLoading: (similarLoading: boolean) => createAction(ProductsActionTypes.SET_PRODUCT_SIMILAR_LOADING, similarLoading),
    setCurrentProductSimilar: (productSimilar: Product[]) => createAction(ProductsActionTypes.SET_CURRENT_PRODUCT_SIMILAR_ACTION, productSimilar),
    setProductSearch: (productSearch: ProductSearch) => createAction(ProductsActionTypes.SET_CURRENT_SEARCH_PARAMS, productSearch),
    resetSearchParams: () => createAction(ProductsActionTypes.RESET_SEARCH_PARAMS)
};


export const setCurrentProduct = (currentProduct: Product) => async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
) => {
    dispatch(ProductActions.setHistoryLoading(true));
    dispatch(ProductActions.setSimilarLoading(true));
    dispatch(ProductActions.setCurrentProduct(currentProduct));
    try {
        let response = await getProductPriceHistory(currentProduct.aff_code);
        if (response) {
            dispatch(ProductActions.setCurrentProductHistory(response));
        } else {
            dispatch(ProductActions.setHistoryLoading(false));
        }
    } catch (e) {
        //product history not set
        dispatch(ProductActions.setHistoryLoading(false));
    }

    try {
        let response = await getSimilarProducts(currentProduct.aff_code);
        if (response) {
            dispatch(ProductActions.setCurrentProductSimilar(response));
        } else {
            dispatch(ProductActions.setSimilarLoading(false));
        }
    } catch (e) {
        //product similar not set
        dispatch(ProductActions.setSimilarLoading(false));
    }
};


export type ProductActions = ActionTypesUnion<typeof ProductActions>