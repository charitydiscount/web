export enum NavigationActionTypes {
    SET_STAGE_ACTION = 'SET_STAGE_ACTION',
    RESET_STAGE_ACTION = 'RESET_STAGE_ACTION'
}

export enum LoginActionTypes {
    SET_LOGGED_USER_ACTION = 'SET_LOGGED_USER_ACTION',
    LOAD_USER_DATA_ACTION = 'LOAD_USER_DATA_ACTION',
    RESET_LOGGED_USER_ACTION = 'RESET_LOGGED_USER_ACTION'
}

export enum LocaleActionTypes {
    SET_LANG_RESOURCES = 'SET_LANG_RESOURCES'
}

export enum ShopsActionTypes {
    SET_SHOPS_ACTION = 'SET_SHOPS_ACTION',
    SET_RATINGS_ACTION = 'SET_RATINGS_ACTION',
    SET_CURRENT_PAGE_ACTION = 'SET_CURRENT_PAGE_ACTION',
    SHOPS_LOADED = 'SHOPS_LOADED',
    SET_SELECTED_SHOP = 'SET_SELECTED_SHOP'
}

export enum CategoryActionTypes {
    SET_CURRENT_CATEGORY_ACTION = 'SET_CURRENT_CATEGORY_ACTION',
    SET_SELECTIONS_ACTION = 'SET_SELECTIONS_ACTION',
    RESET_CATEGORIES = 'RESET_CATEGORIES'
}

export enum ProductsActionTypes {
    SET_CURRENT_PRODUCT_ACTION = 'SET_CURRENT_PRODUCT_ACTION',
    SET_BACK_LINK_ACTION = 'SET_BACK_LINK_ACTION',
    SET_CURRENT_PRODUCT_HISTORY_ACTION = 'SET_CURRENT_PRODUCT_HISTORY_ACTION',
    SET_PRODUCT_HISTORY_LOADING = 'SET_PRODUCT_HISTORY_LOADING',
    SET_PRODUCT_SIMILAR_LOADING = 'SET_PRODUCT_SIMILAR_LOADING',
    SET_CURRENT_PRODUCT_SIMILAR_ACTION = 'SET_CURRENT_PRODUCT_SIMILAR_ACTION',
    SET_CURRENT_SEARCH_PARAMS = 'SET_CURRENT_SEARCH_PARAMS',
    RESET_SEARCH_PARAMS = 'RESET_SEARCH_PARAMS'
}

export enum AdBlockActionTypes {
    SET_AD_BLOCK_ACTIVE = 'SET_AD_BLOCK_ACTIVE'
}

export enum AchievementActionTypes {
    SET_ACHIEVEMENT_MODAL_VISIBLE_ACTION = 'SET_ACHIEVEMENT_MODAL_VISIBLE_ACTION',
    SET_ACHIEVEMENT_MODAL_ACTION = 'SET_ACHIEVEMENT_MODAL_ACTION'
}
