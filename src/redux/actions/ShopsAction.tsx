import {createAction} from "../helper/ActionHelper";
import {ShopsActionTypes} from "./Actions";
import {ActionTypesUnion} from "../helper/TypesHelper";
import {ShopDto} from "../../rest/ShopsService";

export const ShopsActions = {
    setShops: (shops: Array<ShopDto>) => createAction(ShopsActionTypes.SET_SHOPS_ACTION, shops),
    setCurrentPage: (currentPage: number) => createAction(ShopsActionTypes.SET_CURRENT_PAGE_ACTION, currentPage),
    resetShops: () => createAction(ShopsActionTypes.RESET_SHOPS_ACTION),
};

export function setShops(shops: Array<ShopDto>): any {
    if (shops) {
        return (dispatch: any) => {
            dispatch(ShopsActions.setShops(shops));
        }
    }
}

export function setCurrentPage(currentPage: number): any {
    if (currentPage !== undefined) {
        return (dispatch: any) => {
            dispatch(ShopsActions.setCurrentPage(currentPage));
        }
    }
}


export function resetShops() {
    return (dispatch: any) => {
        dispatch(ShopsActions.resetShops());
    }
}

export type ShopsActions = ActionTypesUnion<typeof ShopsActions>