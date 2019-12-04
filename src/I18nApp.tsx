import * as React from "react";
import App from "./App";
import {IntlProvider} from "react-intl";
import {addLocaleData} from "react-intl";
import * as en from 'react-intl/locale-data/en';
import * as ro from 'react-intl/locale-data/ro';
import {ILanguageResource} from "./redux/actions/LocaleAction";
import {connect} from "react-redux";

addLocaleData(en);
addLocaleData(ro);

interface II18nAppProps {

    /**
     * Language resource DTO stored in redux state
     */
    langResources: ILanguageResource,
}

class I18nApp extends React.Component<II18nAppProps> {

    public componentDidMount() {
        window.addEventListener("newContentAvailable", () => {
            console.log("New app version available");
            window.location.reload(true);
        });
    }

    public render() {
        return (
            <IntlProvider textComponent={React.Fragment} locale={this.props.langResources.language}
                          messages={this.props.langResources.resources}>
                <App/>
            </IntlProvider>
        )
    }

}

const mapStateToProps = (state: any) => {
    return {
        langResources: state.locale.langResources,
    }
};

export default connect(mapStateToProps)(I18nApp);
