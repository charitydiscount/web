export enum InputType {
    TEXT = 'text',
    NUMBER = 'number',
    EMAIL = 'email',
}

export enum FirebaseTable {
    CONTACT = 'contact',
    CLICKS = 'clicks',
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
    ACHIEVEMENTS = 'achievements',
    USER_ACHIEVEMENTS = 'user-achievements',
    ACCOUNTS = 'accounts',
}

export enum TableDocument {
    PERFORMANT2 = '2performant',
    GENERAL = 'general',
    IMPORTANT_CATEGORIES = 'importantCategories',
    PROGRAMS = 'programs',
}

export enum StorageRef {
    PROFILE_PHOTOS = 'profilePhotos/',
    ICONS = 'icons/',
    BADGES = 'badges/'
}

export enum TxType {
    CASHOUT = 'CASHOUT',
    BONUS = 'BONUS',
    DONATION = 'DONATION',
    COMMISSION = 'COMMISSION',
    REFERRAL = 'REFERRAL'
}

export enum CmType {
    TWO_PERFORMANT = '2p',
    REFERRAL = 'referral'
}

export enum CommissionStatus {
    pending,
    accepted,
    rejected,
    paid,
}

export enum StorageKey {
    //LOCAL STORAGE
    CATEGORIES = '/oneCD',
    SHOPS = '/twoCD',
    REFERRAL_KEY = '/threeCD', //referral key to update on user
    SELECTED_SHOP = '/fourCD', //if you want to load the selected shop directly
    FAVORITE_SHOPS = '/sixCD',
    CAUSES = '/sevenCD',
    USER = '/eightCD',
    LANG = '/nineCD', //used to remember the language it was selected
    REVIEWS_RATINGS = '/tenCD',
    REDIRECT_MESSAGE = "/redirectMessageDisableCD", //this should never be cleared by us

    //SESSION STORAGE
    GENERAL_CONFIG = '/elevenCD',
    UNIQUE_CODE = '/twelveCD'
}

export const emptyHrefLink = '#';
export const logoPath = '/img/logo.png';
export const noImagePath = '/img/no-image.jpg';
export const profilePictureSuffix = '?height=200';
export const facebookPictureKey = 'facebook';
export const profilePictureDefaultName = 'profilePicture.png';

export const USER_LINK_PLACEHOLDER = '{userId}';
export const PROGRAM_LINK_PLACEHOLDER = '{programUniqueCode}';
