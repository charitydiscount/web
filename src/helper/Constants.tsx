export enum InputType {
    TEXT = 'text',
    NUMBER = 'number',
    EMAIL = 'email'
}

export enum FirebaseTable {
    CONTACT = "contact",
    META = "meta"
}

export enum TableDocument {
    PERFORMANT2 = "2performant",
    PROGRAMS = "programs"
}

export enum StorageRef {
    PROFILE_PHOTOS = "profilePhotos/"
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
    REVIEWS = '/reviewsCD',

    //SESSION STORAGE
    PERFORMANET_2_CODE = '/performant2CodeCD'
}

export enum ProviderType {
    GOOGLE,
    FACEBOOK,
    NORMAL
}

export const emptyHrefLink = '#';
export const logoPath = 'img/logo.png';
export const noImagePath = "/img/no-image.jpg";
export const profilePictureSuffix = "?height=200";
export const facebookPictureKey = "facebook";
export const profilePictureDefaultName = "profilePicture.png";
