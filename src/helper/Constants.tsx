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

export enum TxType{
  CASHOUT,
  BONUS,
  DONATION
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
