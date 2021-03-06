import { createIntl, createIntlCache, IntlShape } from "react-intl";

const cache = createIntlCache();

export function updateIntl(locale, messages) {
    intl = createIntl({locale, messages}, cache);
    return intl;
}

// Globally accessible intl object - IntlGlobal name kept for imports
export let intl: IntlShape;
