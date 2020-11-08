import { createAction } from '../helper/ActionHelper';
import { ShopsActionTypes } from './Actions';
import { ShopDto, fetchPrograms } from '../../rest/ShopsService';
import { ReviewRating } from '../../rest/ReviewService';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { getLocalStorage, setLocalStorage } from '../../helper/StorageHelper';
import { StorageKey } from '../../helper/Constants';
import { fetchConfigInfo } from '../../rest/ConfigService';

export const ShopsActions = {
    setShops: (shops: Array<ShopDto>) =>
        createAction(ShopsActionTypes.SET_SHOPS_ACTION, shops),
    setRatings: (ratings: Map<String, ReviewRating>) =>
        createAction(ShopsActionTypes.SET_RATINGS_ACTION, ratings),
    setCurrentPage: (currentPage: number) =>
        createAction(ShopsActionTypes.SET_CURRENT_PAGE_ACTION, currentPage),
    shopsLoaded: (shops: ShopDto[]) =>
        createAction(ShopsActionTypes.SHOPS_LOADED, shops),
    setSelectedShop: (shop: ShopDto) =>
        createAction(ShopsActionTypes.SET_SELECTED_SHOP, shop),
};

export function setShops(shops: Array<ShopDto>): any {
    if (shops) {
        return (dispatch: any) => {
            dispatch(ShopsActions.setShops(shops));
        };
    }
}

export function setRatings(ratings: Map<String, ReviewRating>): any {
    if (ratings) {
        return (dispatch: any) => {
            dispatch(ShopsActions.setRatings(ratings));
        };
    }
}

export function setCurrentPage(currentPage: number): any {
    if (currentPage !== undefined) {
        return (dispatch: any) => {
            dispatch(ShopsActions.setCurrentPage(currentPage));
        };
    }
}

export const loadShops = () => async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
) => {
    let shops: ShopDto[];
    try {
        await fetchConfigInfo();
        shops = await fetchPrograms();
        setLocalStorage(StorageKey.SHOPS, JSON.stringify(shops));
    } catch (error) {
        const shopsJson = getLocalStorage(StorageKey.SHOPS);
        if (shopsJson) {
            shops = JSON.parse(shopsJson);
        } else {
            shops = [];
        }
    }

    return dispatch(ShopsActions.shopsLoaded(shops));
};
