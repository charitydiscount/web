import React from "react";
import { store } from "../../index";
import { NavigationsAction } from "../../redux/actions/NavigationsAction";
import { Stages } from "../helper/Stages";
import { loadUserPhoto, UserPhotoState } from "../login/UserPhotoHelper";
import FadeLoader from 'react-spinners/FadeLoader';
import { smallerSpinnerCss } from "../../helper/AppHelper";
import { FormattedMessage } from "react-intl";

interface ReferralsState extends UserPhotoState {

}

interface ReferralsProps {

}

class Referrals extends React.Component<ReferralsProps, ReferralsState> {

    constructor(props: ReferralsProps) {
        super(props);
        this.state = {
            photoURL: '',
            displayName: '',
            email: '',
            userId: '',
            normalUser: false,
            isLoadingPhoto: false
        };
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.FRIENDS));
        await loadUserPhoto(this);
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.FRIENDS));
    }

    public render() {
        return (
            <React.Fragment>
                <div className="container p_100">
                    <div className="section-top-border">
                        <div className="row">
                            <div className="col-md-3">
                                <FadeLoader
                                    loading={
                                        this.state
                                            .isLoadingPhoto
                                    }
                                    color={'#1641ff'}
                                    css={smallerSpinnerCss}
                                />
                                {!this.state.isLoadingPhoto && (
                                    <img
                                        className="author_img rounded-circle"
                                        src={
                                            this.state.photoURL
                                        }
                                        alt="Missing"
                                        width={200}
                                        height={200}
                                    />
                                )}
                            </div>
                            <div className="col-md-9 mt-sm-20 left-align-p">
                                <br/>
                                <br/>
                                <p>
                                    <FormattedMessage
                                        id="referral.general.message"
                                        defaultMessage="Invitati prieteni vostri pe charityDiscout cu link-ul de mai jos si primiti 10%
                                    pe langa cashback-ul primit de ei la fiecare achizitie prin charityDiscount"
                                    />
                                </p>
                                <p>
                                    <b>www.charitydiscount.ro/referral/login/{this.state.userId}</b>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Referrals;