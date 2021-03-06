import { LocaleActionTypes } from '../actions/Actions';
import { ILanguageResource, LocaleActions } from '../actions/LocaleAction';
import messages_ro from '../../translations/ro.json';
import messages_en from '../../translations/en.json';
import { getLocalStorage } from '../../helper/StorageHelper';
import { Languages, StorageKey } from '../../helper/Constants';
import { updateIntl } from "../../helper/IntlGlobal";

const messages = {
    ro: messages_ro,
    en: messages_en,
};

export interface ILocaleState {
    langResources: ILanguageResource | null;
}

const initialState: ILocaleState = {
    langResources: {
        language: Languages.RO,
        resources:
            messages[Languages.RO],
    },
};

export default function (
    state: ILocaleState = initialState,
    action: LocaleActions
): ILocaleState {
    switch (action.type) {
        case LocaleActionTypes.SET_LANG_RESOURCES: {
            return {
                ...state,
                langResources: action.payload,
            };
        }
        default: {
            if (state) {
                const lang = getLocalStorage(StorageKey.LANG);
                if (lang) {
                    if (lang === Languages.EN || lang === Languages.RO) {
                        state.langResources = {
                            language: lang,
                            resources: messages[lang],
                        };
                    } else {
                        state.langResources = {
                            language: Languages.RO,
                            resources: messages[Languages.RO],
                        };
                    }

                }
            }
            updateIntl(state.langResources.language, state.langResources.resources);
            return {...state};
        }
    }
}
