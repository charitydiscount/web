import React, { useEffect, useState } from 'react';
import { store } from '../../../index';
import { NavigationsAction } from '../../../redux/actions/NavigationsAction';
import { Stages } from '../../helper/Stages';
import FadeLoader from 'react-spinners/FadeLoader';
import { addDefaultImgSrc, getImagePath, smallerSpinnerCss } from '../../../helper/AppHelper';
import { FormattedMessage } from 'react-intl';
import ReferralRow from './ReferralRow';
import {
    fetchReferrals,
    ReferralDto,
    buildDynamicLink,
} from '../../../rest/ReferralService';
import { UserInfoDto } from "../login/AuthHelper";
import { connect } from "react-redux";
import { intl } from "../../../helper/IntlGlobal";

const Referrals = (props: { userInfo: UserInfoDto }) => {

    const [referralLink, setReferralLink] = useState<string>('');
    const [isLoadingReferrals, setLoadingReferrals] = useState<boolean>(false);
    const [referrals, setReferrals] = useState<ReferralDto[]>([]);

    useEffect(() => {
        store.dispatch(NavigationsAction.setStageAction(Stages.FRIENDS));
        populateReferrals();
    }, []);

    const populateReferrals = async () => {
        buildDynamicLink(
            intl.formatMessage({id: 'referral.meta.title'}),
            intl.formatMessage({
                id: 'referral.meta.description',
            })
        ).then((response) => {
                setReferralLink(response);
            }
        )

        fetchReferrals()
            .then((response) => {
                setLoadingReferrals(false);
                setReferrals(response as ReferralDto[]);
            })
            .catch(() => {
                setLoadingReferrals(false);
            })
    }

    const referralList =
        referrals && referrals.length > 0
            ? referrals.map((referral, index) => {
                return <ReferralRow key={index} referral={referral}/>;
            })
            : null;

    return (
        <React.Fragment>
            <section className={'product_description_area'}>
                <div className={'container'}>
                    <div className={'tab-content'}>
                        <div className="row">
                            <div className="col-md-3 d-flex">
                                <img
                                    className="author_img rounded-circle m-auto"
                                    src={getImagePath(props.userInfo.photoURL)}
                                    alt="Missing"
                                    width={150}
                                    height={150}
                                    onError={addDefaultImgSrc}
                                />
                            </div>
                            <div className="col-md-9 mt-sm-20 left-align-p">
                                <br/>
                                <br/>
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
                                        {referralLink}
                                    </b>
                                </p>
                            </div>
                        </div>
                    </div>
                    <FadeLoader
                        loading={isLoadingReferrals}
                        color={'#e31f29'}
                        css={smallerSpinnerCss}
                    />
                    {!isLoadingReferrals &&
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

const mapStateToProps = (state: any) => {
    return {
        userInfo: state.user.userInfo
    };
};

export default connect(mapStateToProps, null)(Referrals);
