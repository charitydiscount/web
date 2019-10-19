import {ActionTypesUnion} from "../helper/TypesHelper";
import {createAction} from "../helper/ActionHelper";
import {LocaleActionTypes} from "./Actions";
import messages_ro from "../../translations/ro.json";
import messages_en from "../../translations/en.json";

const messages = {
    'ro': messages_ro,
    'en': messages_en
};

export interface ILanguageResource {
    language: string,
    resources: any
}

export const LocaleAction = {
    setLangResources: (langResources: ILanguageResource | null) => createAction(LocaleActionTypes.SET_LANG_RESOURCES, langResources)
};
export type LocaleActions = ActionTypesUnion<typeof LocaleAction>

export function setLangResources(currentLocale: string): any {
    return (dispatch: any) => {
        if (currentLocale === "en") {
            dispatch(LocaleAction.setLangResources({language: "en", resources: messages['en']}))
        } else {
            dispatch(LocaleAction.setLangResources({language: "ro", resources: messages['ro']}))
        }
    }
}