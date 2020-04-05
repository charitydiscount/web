import React from 'react';
import { store } from '../../index';
import { NavigationsAction } from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import { loadCurrentUserPhoto, UserPhotoState } from '../login/UserPhotoHelper';
import FadeLoader from 'react-spinners/FadeLoader';
import { smallerSpinnerCss } from '../../helper/AppHelper';
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl';
import ReferralRow from './ReferralRow';
import {
    fetchReferrals,
    ReferralDto,
    buildDynamicLink,
} from '../../rest/ReferralService';

interface ReferralsState extends UserPhotoState {
    referrals: ReferralDto[];
    isLoadingReferrals: boolean;
    referralLink: string;
}

interface ReferralsProps {
    intl: IntlShape;
}

class Referrals extends React.Component<ReferralsProps, ReferralsState> {
    constructor(props: ReferralsProps) {
        super(props);
        this.state = {
            photoURL: '',
            isLoadingPhoto: false,
            isLoadingReferrals: true,
            referrals: [],
            referralLink: '',
        };
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.FRIENDS));
        try {
            const referralLink = await buildDynamicLink(
                this.props.intl.formatMessage({ id: 'referral.meta.title' }),
                this.props.intl.formatMessage({
                    id: 'referral.meta.description',
                })
            );
            this.setState({
                referralLink,
            });
        } catch (error) {
            console.log(error);
        }
        await loadCurrentUserPhoto(this);
        try {
            let response = await fetchReferrals();
            if (response) {
                this.setState({
                    referrals: response as ReferralDto[],
                    isLoadingReferrals: false,
                });
            } else {
                this.setState({
                    isLoadingReferrals: false,
                });
            }
        } catch (e) {
            this.setState({
                isLoadingReferrals: false,
            });
            //referrals not loaded
        }
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.FRIENDS));
    }

    public render() {
        const referralList =
            this.state.referrals && this.state.referrals.length > 0
                ? this.state.referrals.map((referral, index) => {
                      return <ReferralRow key={index} referral={referral} />;
                  })
                : null;

        return (
            <React.Fragment>
                <section className={'product_description_area'}>
                    <div className={'container'}>
                        <div className={'tab-content'}>
                            <div className="row">
                                <div className="col-md-3 d-flex">
                                    <FadeLoader
                                        loading={this.state.isLoadingPhoto}
                                        color={'#1641ff'}
                                        css={smallerSpinnerCss}
                                    />
                                    {!this.state.isLoadingPhoto && (
                                        <img
                                            className="author_img rounded-circle m-auto"
                                            src={this.state.photoURL}
                                            alt="Missing"
                                            width={150}
                                            height={150}
                                        />
                                    )}
                                </div>
                                <div className="col-md-9 mt-sm-20 left-align-p">
                                    <br />
                                    <br />
                                    <h5>
                                        <FormattedMessage
                                            id="referral.title.message"
                                            defaultMessage="Invită-ți prietenii și economisiți împreună"
                                        />
                                    </h5>
                                    <p>
                                        <FormattedMessage
                                            id="referral.general.message"
                                            defaultMessage="Invitati prieteni vostri pe charityDiscout cu link-ul de mai jos si primiti 10%
                                    pe langa cashback-ul primit de ei la fiecare achizitie prin charityDiscount"
                                        />
                                    </p>
                                    <p>
                                        <b
                                            style={{
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {this.state.referralLink}
                                        </b>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <FadeLoader
                            loading={this.state.isLoadingReferrals}
                            color={'#1641ff'}
                            css={smallerSpinnerCss}
                        />
                        {!this.state.isLoadingReferrals &&
                            referralList &&
                            referralList.length > 0 && (
                                <React.Fragment>
                                    <div className={'tab-content'}>
                                        <div className={'row'}>
                                            {referralList}
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default injectIntl(Referrals);
