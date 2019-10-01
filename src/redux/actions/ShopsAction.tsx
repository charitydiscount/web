import {createAction} from "../helper/ActionHelper";
import {ShopsActionTypes} from "./Actions";
import {ActionTypesUnion} from "../helper/TypesHelper";
import {ShopDto} from "../../rest/ShopsService";
import {ReviewRating} from "../../rest/ReviewService";

export const ShopsActions = {
    setShops: (shops: Array<ShopDto>) => createAction(ShopsActionTypes.SET_SHOPS_ACTION, shops),
    setRatings: (ratings: Map<String, ReviewRating>) => createAction(ShopsActionTypes.SET_RATINGS_ACTION, ratings),
    setCurrentPage: (currentPage: number) => createAction(ShopsActionTypes.SET_CURRENT_PAGE_ACTION, currentPage)
};

export function setShops(shops: Array<ShopDto>): any {
    if (shops) {
        return (dispatch: any) => {
            dispatch(ShopsActions.setShops(shops));
        }
    }
}

export function setRatings(ratings: Map<String, ReviewRating>): any {
    if (ratings) {
        return (dispatch: any) => {
            dispatch(ShopsActions.setRatings(ratings));
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

export type ShopsActions = ActionTypesUnion<typeof ShopsActions>