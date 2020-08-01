import { injectIntl, IntlShape } from 'react-intl';
import * as React from 'react';
import { ReferralDto } from '../../rest/ReferralService';
import { loadUserIdPhoto, UserPhotoState } from '../login/UserPhotoHelper';
import {
    getNotPaidSumForReferralId,
    getPaidSumForReferralId,
} from '../../rest/WalletService';
import { noImagePath } from "../../helper/Constants";

interface ReferralRowState extends UserPhotoState {
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
            photoURL: '',
            userId: '',
            referralPaidSum: 0,
            referralNotPaidSum: 0,
            isLoadingPhoto: false,
        };
    }

    async componentDidMount() {
        await loadUserIdPhoto(
            this,
            this.props.referral.photoUrl,
            this.props.referral.userId
        );
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
                    <h6 className="blue-color">{this.state.referralPaidSum}</h6>
                    <h6 className="pending-color">
                        {this.state.referralNotPaidSum > 0
                            ? this.state.referralNotPaidSum
                            : '-'}
                    </h6>
                    <div className="f_p_img d-flex">
                        {!this.state.isLoadingPhoto && (
                            <img
                                className="author_img rounded-circle"
                                src={this.state.photoURL}
                                alt=""
                                height={95}
                                width={95}
                                onError={() =>
                                    this.setState({
                                        photoURL: noImagePath
                                    })
                                }
                            />
                        )}
                    </div>
                    <h4>{this.props.referral.name}</h4>
                </div>
            </React.Fragment>
        );
    }
}

export default injectIntl(ReferralRow);
