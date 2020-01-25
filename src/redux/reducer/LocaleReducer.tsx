import { LocaleActionTypes } from '../actions/Actions';
import { ILanguageResource, LocaleActions } from '../actions/LocaleAction';
import messages_ro from '../../translations/ro.json';
import messages_en from '../../translations/en.json';
import { getLocalStorage } from '../../helper/StorageHelper';
import { StorageKey } from '../../helper/Constants';

let language = navigator.language.split(/[-_]/)[0]; // language without region code, browser language
const messages = {
    ro: messages_ro,
    en: messages_en,
};

export interface ILocaleState {
    langResources: ILanguageResource | null;
}

const initialState: ILocaleState = {
    langResources: {
        language: language === 'ro' || language === 'en' ? language : 'ro',
        resources:
            messages[language === 'ro' || language === 'en' ? language : 'ro'],
    },
};

export default function(
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
                    if (lang === 'en' || lang === 'ro') {
                        state.langResources = {
                            language: lang,
                            resources: messages[lang],
                        };
                    } else {
                        state.langResources = {
                            language: 'en',
                            resources: messages['en'],
                        };
                    }
                }
            }
            return { ...state };
        }
    }
}
