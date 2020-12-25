import { createAction } from "../helper/ActionHelper";
import { ProductsActionTypes } from "./Actions";
import { Product } from "../../rest/ProductsService";
import { ActionTypesUnion } from "../helper/TypesHelper";

export const ProductActions = {
    setCurrentProduct: (currentProduct: Product) => createAction(ProductsActionTypes.SET_CURRENT_PRODUCT_ACTION, currentProduct)
};

export type ProductActions = ActionTypesUnion<typeof ProductActions>