import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import NavigatorReducer, { INavigationState } from './NavigatorReducer';
import UserReducer, { IUserState } from './UserReducer';
import ShopsReducer, { IShopsState } from './ShopsReducer';
import CategoryReducer, { ICategoryState } from './CategoryReducer';
import LocaleReducer, { ILocaleState } from './LocaleReducer';
import AdBlockReducer, { IAdBlockState } from "./AdBlockReducer";
import AchievementReducer, { IAchievementState } from "./AchievementReducer";
import ProductReducer, { IProductState } from "./ProductReducer";

export interface AppState {
    router: any;
    navigation: INavigationState;
    user: IUserState;
    shops: IShopsState;
    achievement: IAchievementState;
    category: ICategoryState;
    adBlock: IAdBlockState;
    product: IProductState
    locale: ILocaleState;
}

// Used to combine all reducers for full functionality
export default (history: any) =>
    combineReducers({
        router: connectRouter(history),
        navigation: NavigatorReducer,
        user: UserReducer,
        shops: ShopsReducer,
        achievement: AchievementReducer,
        product: ProductReducer,
        category: CategoryReducer,
        locale: LocaleReducer,
        adBlock: AdBlockReducer
    });
