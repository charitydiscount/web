import { injectIntl, IntlShape } from 'react-intl';
import * as React from 'react';
import { ReferralDto } from '../../rest/ReferralService';
import {
    getNotPaidSumForReferralId,
    getPaidSumForReferralId,
} from '../../rest/WalletService';
import { addDefaultImgSrc, getImagePath } from "../../helper/AppHelper";

interface ReferralRowState {
    referralPaidSum: number;
    referralNotPaidSum: number;
}

interface ReferralRowProps {
    referral: ReferralDto;
    intl: IntlShape;
}

class ReferralRow extends React.Component<ReferralRowProps, ReferralRowState> {
    constructor(props: ReferralRowProps) {
        super(props);
        this.state = {
            referralPaidSum: 0,
            referralNotPaidSum: 0
        };
    }

    async componentDidMount() {
        try {
            let paidResponse = await getPaidSumForReferralId(
                this.props.referral.userId
            );
            let notPaidResponse = await getNotPaidSumForReferralId(
                this.props.referral.userId
            );
            if (paidResponse && notPaidResponse) {
                this.setState({
                    referralPaidSum: paidResponse,
                    referralNotPaidSum: notPaidResponse,
                });
            }
        } catch (e) {
            //referral sum is 0
        }
    }

    public render() {
        return (
            <React.Fragment>
                <div className="col-md-3 col-sm-6 f_p_item p-2">
                    <h6 className="referal-sum">
                        {this.state.referralPaidSum}
                    </h6>
                    <h6 className="pending-color">
                        {this.state.referralNotPaidSum > 0
                            ? this.state.referralNotPaidSum
                            : '-'}
                    </h6>
                    <div className="f_p_img d-flex">
                        <img
                            className="author_img rounded-circle"
                            src={getImagePath(this.props.referral.photoUrl)}
                            alt="Missing"
                            height={95}
                            width={95}
                            onError={addDefaultImgSrc}
                        />
                    </div>
                    <h4>{this.props.referral.name}</h4>
                </div>
            </React.Fragment>
        );
    }
}

export default injectIntl(ReferralRow);
