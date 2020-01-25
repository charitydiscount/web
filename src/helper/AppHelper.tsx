import { getAffiliateCode } from '../rest/ConfigService';
import {
    getLocalStorage,
    removeLocalStorage,
    setLocalStorage,
} from './StorageHelper';
import { StorageKey } from './Constants';
import { LoginDto } from '../components/login/LoginComponent';
import { css } from '@emotion/core';
import { store, auth } from '../index';
import { setLangResources } from '../redux/actions/LocaleAction';

/**
 * Used to compute 2performant rest call and redirect
 * @param uniqueCode - shop unique code
 * @param redirectUrl - the program url where the user should be redirected
 * @param userId - the id of the user to which to commission must be assigned
 */
export function computeUrl(uniqueCode: string, redirectUrl: string) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }
    const baseUrl =
        'https://event.2performant.com/events/click?ad_type=quicklink';
    const affCode = '&aff_code=' + getAffiliateCode();
    const unique = '&unique=' + uniqueCode;
    const redirect = '&redirect_to=' + redirectUrl;
    const tag = '&st=' + auth.currentUser.uid;
    return baseUrl + affCode + unique + redirect + tag;
}

export function computeProductUrl(affUrl: string) {
    if (!auth.currentUser) {
        throw Error('User not logged in');
    }

    const baseUrl = affUrl;
    const tag = '&st=' + auth.currentUser.uid;
    return baseUrl + tag;
}

export const spinnerCss = css`
    display: block;
    margin: 200px auto;
`;

export const smallerSpinnerCss = css`
    display: block;
    margin: 50px auto;
`;

export const emptyBackgroundCss = css`
    height: 0px !important;
`;

export function isEmptyString(field) {
    return !!field && field.trim().length;
}

export function getUserKeyFromStorage() {
    const user = getLocalStorage(StorageKey.USER);
    if (user) {
        const keyExist = (JSON.parse(user) as LoginDto).uid;
        if (keyExist) {
            return keyExist;
        } else {
            removeLocalStorage(StorageKey.USER);
        }
    }
    //the app can't work without user key from storage, so when reloading it will be created again
    window.location.reload();
}

export function getUserFromStorage() {
    const user = getLocalStorage(StorageKey.USER);
    if (user) {
        return user;
    }
    //the app can't work without user key from storage, so when reloading it will be created again
    window.location.reload();
    return null;
}

export function onLanguageChange(event) {
    setLocalStorage(StorageKey.LANG, event.value);
    store.dispatch(setLangResources(event.value));
}

export function getUrlParameter(param: string) {
    // eslint-disable-next-line
    const name = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null
        ? ''
        : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function roundCommission(comission) {
    return comission.toFixed(2);
}

export function roundMoney(money) {
    return money.toFixed(2);
}

export const dateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
};
