import * as React from 'react';
import {store} from '../../../index';
import {NavigationsAction} from '../../../redux/actions/NavigationsAction';
import {Stages} from '../../helper/Stages';
import {FormattedMessage} from 'react-intl';
import {connect} from "react-redux";
import PrivacyTextRO from "./PrivacyTextRO";
import PrivacyTextEN from "./PrivacyTextEN";

interface IPrivacyProps {
    currentLocale?: string
}

class Privacy extends React.Component<IPrivacyProps> {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.PRIVACY));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.PRIVACY));
    }

    public render() {
        return (
            <React.Fragment>
                <div className="container p_90">
                    <div className="p-2 p-md-4">
                        <h3 className="mb-30 title_color">
                            <FormattedMessage
                                id="privacy.title"
                                defaultMessage="Privacy"
                            />
                        </h3>
                        <div className="mt-sm-20 left-align-p">
                            {this.props.currentLocale === "ro" ?
                                <PrivacyTextRO/> :
                                <PrivacyTextEN/>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const
    mapStateToProps = (state: any) => {
        return {
            currentLocale: state.locale.langResources.language
        }
    };

export default connect(mapStateToProps)(Privacy);
