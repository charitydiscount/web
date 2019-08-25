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
  AFFILIATE_CODE = '/affiliateCodeCD',
}

export const emptyHrefLink = '#';
