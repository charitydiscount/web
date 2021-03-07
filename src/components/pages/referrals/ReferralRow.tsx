import * as React from 'react';
import { ReferralDto } from '../../../rest/ReferralService';
import {
    getNotPaidSumForReferralId,
    getPaidSumForReferralId,
} from '../../../rest/WalletService';
import { addDefaultImgSrc, getImagePath } from "../../../helper/AppHelper";
import { useEffect, useState } from "react";
import { store } from "../../../index";
import { NavigationsAction } from "../../../redux/actions/NavigationsAction";
import { Stages } from "../../helper/Stages";

const ReferralRow = (props: { referral: ReferralDto }) => {

    const [referralPaidSum, setReferralPaidSum] = useState<number>(0);
    const [referralNotPaidSum, setReferralNotPaidSum] = useState<number>(0);

    useEffect(() => {
        store.dispatch(NavigationsAction.setStageAction(Stages.REFERRAL));
        const populateSums = async () => {
            let paidResponse = await getPaidSumForReferralId(props.referral.userId);
            setReferralPaidSum(paidResponse);
            let notPaidResponse = await getNotPaidSumForReferralId(props.referral.userId);
            setReferralNotPaidSum(notPaidResponse);
        }
        populateSums();
    }, [props])

    return (
        <React.Fragment>
            <div className="col-md-3 col-sm-6 f_p_item p-2">
                <h6 className="referal-sum">
                    {referralPaidSum}
                </h6>
                <h6 className="pending-color">
                    {referralNotPaidSum > 0
                        ? referralNotPaidSum
                        : '-'}
                </h6>
                <div className="f_p_img d-flex">
                    <img
                        className="author_img rounded-circle"
                        src={getImagePath(props.referral.photoUrl)}
                        alt="Missing"
                        height={95}
                        width={95}
                        onError={addDefaultImgSrc}
                    />
                </div>
                <h4>{props.referral.name}</h4>
            </div>
        </React.Fragment>
    );
}

export default ReferralRow;
