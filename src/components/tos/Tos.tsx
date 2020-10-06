import * as React from 'react';
import {store} from '../../index';
import {NavigationsAction} from '../../redux/actions/NavigationsAction';
import {Stages} from '../helper/Stages';
import {FormattedMessage} from 'react-intl';
import {connect} from "react-redux";
import TosTextRO from "./TosTextRO";
import TosTextEN from "./TosTextEN";

interface TosProps {
    currentLocale?: string
}


class Tos extends React.Component<TosProps> {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.TOS));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.TOS));
    }

    public render() {
        return (
            <React.Fragment>
                <div className="container p_90">
                    <div className="p-2 p-md-4">
                        <h3 className="mb-30">
                            <FormattedMessage
                                id="tos.title"
                                defaultMessage="Terms of agreement"
                            />
                        </h3>
                        <div className="mt-sm-20 left-align-p">
                                {this.props.currentLocale === "ro" ?
                                    <TosTextRO/> :
                                    <TosTextEN/>
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

export default connect(mapStateToProps)(Tos);

