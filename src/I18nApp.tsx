import * as React from 'react';
import App from './App';
import { IntlProvider } from 'react-intl';
import { defineMessages } from 'react-intl';
import * as en from './translations/en.json';
import * as ro from './translations/ro.json';
import { ILanguageResource } from './redux/actions/LocaleAction';
import { connect } from 'react-redux';

defineMessages(en);
defineMessages(ro);

const I18nApp = (props: { langResources: ILanguageResource }) => {
    return (
        <IntlProvider
            textComponent={React.Fragment}
            locale={props.langResources.language}
            messages={props.langResources.resources}
        >
            <App/>
        </IntlProvider>
    );
}

const mapStateToProps = (state: any) => {
    return {
        langResources: state.locale.langResources,
    };
};

export default connect(mapStateToProps)(I18nApp);
