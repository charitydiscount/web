import * as React from 'react';
import { CauseDto } from '../../../rest/CauseService';
import { Routes } from '../../helper/Routes';
import { FormattedMessage } from 'react-intl';
import { getImagePath, roundMoney } from "../../../helper/AppHelper";
import { AppState } from "../../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

interface ICauseProps {
    cause: CauseDto;

    //general state
    isLoggedIn: boolean
}

const Cause = (props: ICauseProps) => {

    return (
        <React.Fragment>
            <div className="col-lg-6">
                <h2>{props.cause.details.title}</h2>
                {props.cause.details.funds && (
                    <h4>
                        <FormattedMessage
                            id="cause.donated"
                            defaultMessage="Donated: "
                        />
                        {roundMoney(props.cause.details.funds)} RON
                    </h4>
                )}
                <a
                    className="hot_deal_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={props.cause.details.site}
                >
                    <div className="hot_deal_box">
                        {props.cause.details.images && props.cause.details.images[0] && props.cause.details.images[0].url &&
                        <img
                            alt="Missing"
                            src={getImagePath(props.cause.details.images[0].url)}
                            style={{height: 300}}
                            className="img-fluid"
                        />
                        }
                        <div className="content">Website</div>
                    </div>
                </a>
                <br/>
                <Link to={props.isLoggedIn ?
                    Routes.WALLET + '/donate/' + props.cause.id :
                    Routes.LOGIN
                }
                      className="btn submit_btn genric-btn circle">
                    <FormattedMessage
                        id="cause.contribute.button"
                        defaultMessage="Contribute"
                    />
                </Link>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state: AppState) => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

export default connect(mapStateToProps)(Cause);
