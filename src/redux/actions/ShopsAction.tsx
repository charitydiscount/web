import {ShopDtoWrapper} from "../../components/products/ShopDto";
import {createAction} from "../helper/ActionHelper";
import {ShopsActionTypes} from "./Actions";
import {ActionTypesUnion} from "../helper/TypesHelper";

export const ShopsActions = {
    setShops: (shopWrapper: ShopDtoWrapper[]) => createAction(ShopsActionTypes.SET_SHOPS_ACTION, shopWrapper),
    resetShops: () => createAction(ShopsActionTypes.RESET_SHOPS_ACTION),
};

export function setShops(shopWrapper: ShopDtoWrapper[]): any {
    if (shopWrapper !== null) {
        return (dispatch: any) => {
            dispatch(ShopsActions.setShops(shopWrapper));
        }
    }
}

export function resetShops() {
    return (dispatch: any) => {
        dispatch(ShopsActions.resetShops());
    }
}

export type ShopsActions = ActionTypesUnion<typeof ShopsActions>