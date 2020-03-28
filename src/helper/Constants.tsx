export enum InputType {
    TEXT = 'text',
    NUMBER = 'number',
    EMAIL = 'email',
}

export enum FirebaseTable {
    CONTACT = 'contact',
    META = 'meta',
    FAVORITE_SHOPS = 'favoriteShops',
    REFERRAL_REQUESTS = 'referral-requests',
    REFERRALS = 'referrals',
    REVIEWS = 'reviews',
    SHOPS = 'programs',
    CASES = 'cases',
    USERS = 'users',
    POINTS = 'points',
    COMMISSIONS = 'commissions',
    REQUESTS = 'requests',
    OTP_REQUESTS = 'otp-requests',
    OTPS = 'otps',
    PROMOTIONS = 'promotions',
    ACCOUNTS = 'accounts',
}

export enum TableDocument {
    PERFORMANT2 = '2performant',
    PROGRAMS = 'programs',
}

export enum StorageRef {
    PROFILE_PHOTOS = 'profilePhotos/',
}

export enum TxType {
    CASHOUT = 'CASHOUT',
    BONUS = 'BONUS',
    DONATION = 'DONATION',
    COMMISSION = 'COMMISSION',
}

export enum CommissionStatus {
    pending,
    accepted,
    rejected,
    paid,
}

export enum StorageKey {
    //LOCAL STORAGE
    CATEGORIES = '/categoriesCD',
    SHOPS = '/shopsCD',
    REFERRAL_KEY = '/referralCD',
    FAVORITE_SHOPS = '/favoriteShopsCD',
    CAUSES = '/causesCD',
    USER = '/userCD',
    LANG = '/langCD',
    REVIEWS = '/reviewsCD',

    //SESSION STORAGE
    PERFORMANET_2_CODE = '/performant2CodeCD',
}

export const ProviderType = ['google', 'facebook', 'normal'];

export const emptyHrefLink = '#';
export const logoPath = '/img/logo.png';
export const noImagePath = '/img/no-image.jpg';
export const profilePictureSuffix = '?height=200';
export const facebookPictureKey = 'facebook';
export const profilePictureDefaultName = 'profilePicture.png';

export const USER_LINK_PLACEHOLDER = '{userId}';
export const PROGRAM_LINK_PLACEHOLDER = '{programUniqueCode}';
