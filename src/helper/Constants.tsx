export enum InputType {
    TEXT = 'text',
    NUMBER = 'number',
    EMAIL = 'email'
}

export enum FirebaseTable {
    CONTACT = "contact",
    META = "meta",
    FAVORITE_SHOPS = "favoriteShops",
    REVIEWS = "reviews",
    SHOPS = "shops",
    CASES = "cases",
    USERS = "users",
    POINTS = "points",
    COMMISSIONS = "commissions",
    REQUESTS = "requests",
    OTP_REQUESTS = "otp-requests",
    OTPS = "otps"
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
    DONATION,
    COMMISSION
}

export enum CommissionStatus {
    pending,
    rejected,
    accepted,
    paid
}

export enum StorageKey {
    //LOCAL STORAGE
    CATEGORIES = '/categoriesCD',
    SHOPS = '/shopsCD',
    FAVORITE_SHOPS = '/favoriteShopsCD',
    CAUSES = '/causesCD',
    USER = '/userCD',
    LANG = '/langCD',
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
export const logoPath = '/img/logo.png';
export const noImagePath = "/img/no-image.jpg";
export const profilePictureSuffix = "?height=200";
export const facebookPictureKey = "facebook";
export const profilePictureDefaultName = "profilePicture.png";
