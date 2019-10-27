export enum ButtonType {
    SUBMIT = 'submit',
    BUTTON = 'button',
}

export enum InputType {
    TEXT = 'text',
    PASSWORD = 'password',
    RADIO = 'radio',
    CHECKBOX = 'checkbox',
    DATE = 'date',
    TIME = 'time',
    NUMBER = 'number',
    EMAIL = 'email'
}

export enum FirebaseTable {
    CONTACT = "contact"

}

export enum TxType {
    CASHOUT,
    BONUS,
    DONATION
}

export enum CommissionStatus {
    pending,
    rejected,
    approved,
    paid
}

export enum StorageKey {
    //LOCAL STORAGE
    CATEGORIES = '/categoriesCD',
    SHOPS = '/shopsCD',
    FAVORITE_SHOPS = '/favoriteShopsCD',
    FAVORITE_SHOPS_ID = '/favoriteShopsIdCD',
    CAUSES = '/causesCD',
    USER = '/userCD',

    //SESSION STORAGE
    AFFILIATE_CODE = '/affiliateCodeCD'
}

export enum ProviderType {
    GOOGLE,
    FACEBOOK,
    NORMAL
}

export const emptyHrefLink = '#';
export const logoSrc = 'img/logo.png';
