import {ShopDto} from "../../components/products/ShopDto";
import {createAction} from "../helper/ActionHelper";
import {ShopsActionTypes} from "./Actions";
import {ActionTypesUnion} from "../helper/TypesHelper";

export const ShopsActions = {
    setShops: (shops: Array<ShopDto>) => createAction(ShopsActionTypes.SET_SHOPS_ACTION, shops),
    resetShops: () => createAction(ShopsActionTypes.RESET_SHOPS_ACTION),
};

export function setShops(shops: Array<ShopDto>): any {
    if (shops) {
        return (dispatch: any) => {
            dispatch(ShopsActions.setShops(shops));
        }
    }
}

export function resetShops() {
    return (dispatch: any) => {
        dispatch(ShopsActions.resetShops());
    }
}

export type ShopsActions = ActionTypesUnion<typeof ShopsActions>