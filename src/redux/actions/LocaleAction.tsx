import { ActionTypesUnion } from "../helper/TypesHelper";
import { createAction } from "../helper/ActionHelper";
import { LocaleActionTypes } from "./Actions";
import messages_ro from "../../translations/ro.json";
import messages_en from "../../translations/en.json";
import { Languages } from "../../helper/Constants";
import { updateIntl } from "../../helper/IntlGlobal";

export const messages = {
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
        if (currentLocale === Languages.EN) {
            dispatch(LocaleAction.setLangResources({language: Languages.EN, resources: messages[Languages.EN]}))
            updateIntl(Languages.EN, messages[Languages.EN]);
        } else {
            dispatch(LocaleAction.setLangResources({language: Languages.RO, resources: messages[Languages.RO]}))
            updateIntl(Languages.RO, messages[Languages.RO]);
        }
    }
}