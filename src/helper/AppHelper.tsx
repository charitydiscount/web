import { getAffiliateCode } from '../rest/ConfigService';
import { getLocalStorage, setLocalStorage } from './StorageHelper';
import {
    StorageKey,
    PROGRAM_LINK_PLACEHOLDER,
    USER_LINK_PLACEHOLDER,
} from './Constants';
import { css } from '@emotion/core';
import { store, auth } from '../index';
import { setLangResources } from '../redux/actions/LocaleAction';

/**
 * Used to compute 2performant rest call and redirect
 * @param affiliateUrl - for case when it's another url than 2performant
 * @param uniqueCode - shop unique code
 * @param redirectUrl - the program url where the user should be redirected
 */
export function computeUrl(affiliateUrl:string, uniqueCode: string, redirectUrl: string) {
    if (!auth.currentUser || !auth.currentUser.uid) {
        throw Error('User not logged in'); //TODO: this error should be nice treated
    }
    if (affiliateUrl) {
        // Replace the shop unique code and the user ID into the given url
        return affiliateUrl
            .replace(PROGRAM_LINK_PLACEHOLDER, uniqueCode)
            .replace(USER_LINK_PLACEHOLDER, auth.currentUser.uid);
    } else {
        const baseUrl =
            'https://event.2performant.com/events/click?ad_type=quicklink';
        const affCode = '&aff_code=' + getAffiliateCode();
        const unique = '&unique=' + uniqueCode;
        const redirect = '&redirect_to=' + redirectUrl;
        const tag = '&st=' + auth.currentUser.uid;
        return baseUrl + affCode + unique + redirect + tag;
    }
}

export function computeProductUrl(affUrl: string) {
    if (!auth.currentUser || !auth.currentUser.uid) {
        throw Error('User not logged in'); //TODO: this error should be nice treated
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

export function redirectToAbout(event: any) {
    event.preventDefault();
    window.location.href = window.location.origin + "/landing-" +
        (getLocalStorage(StorageKey.LANG) ? getLocalStorage(StorageKey.LANG) : 'ro') +
        ".html";
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

export const emailRegexp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");