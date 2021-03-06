import * as React from 'react';
import { store } from '../../../index';
import { NavigationsAction } from '../../../redux/actions/NavigationsAction';
import { Stages } from '../../helper/Stages';
import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";
import PrivacyRO from "./PrivacyRO";
import PrivacyEN from "./PrivacyEN";
import { useEffect } from "react";
import { Languages } from "../../../helper/Constants";

const Privacy = (props: { locale: string }) => {

    useEffect(() => {
        store.dispatch(NavigationsAction.setStageAction(Stages.PRIVACY));
    }, []);

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
                        {props.locale === Languages.RO ?
                            <PrivacyRO/> :
                            <PrivacyEN/>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const
    mapStateToProps = (state: any) => {
        return {
            locale: state.locale.langResources.language
        }
    };

export default connect(mapStateToProps)(Privacy);
