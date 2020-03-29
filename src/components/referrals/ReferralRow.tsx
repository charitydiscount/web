import { injectIntl, IntlShape } from "react-intl";
import * as React from "react";
import { ReferralDto } from "../../rest/ReferralService";
import { loadUserIdPhoto, UserPhotoState } from "../login/UserPhotoHelper";
import { getSumForReferralId } from "../../rest/WalletService";

interface ReferralRowState extends UserPhotoState {
    referralSum: number
}

interface ReferralRowProps {
    referral: ReferralDto,
    intl: IntlShape;
}

class ReferralRow extends React.Component<ReferralRowProps, ReferralRowState> {

    constructor(props: ReferralRowProps) {
        super(props);
        this.state = {
            photoURL: '',
            userId: '',
            referralSum: 0,
            isLoadingPhoto: false
        };
    }

    async componentDidMount() {
        await loadUserIdPhoto(this, this.props.referral.photoUrl, this.props.referral.userId);
        try {
            let response = await getSumForReferralId(this.props.referral.userId);
            if (response) {
                this.setState({
                    referralSum: response
                })
            }
        } catch (e) {
            //referral sum is 0
        }
    }

    public render() {
        return (
            <React.Fragment>
                <div
                    className="col-md-3 col-sm-6 f_p_item p-2"
                    style={{cursor: 'pointer'}}
                >
                    <h6 className="blue-color">
                        {this.state.referralSum}
                    </h6>
                    <div className="f_p_img d-flex">
                        {!this.state.isLoadingPhoto && (
                            <img
                                className="author_img rounded-circle"
                                src={this.state.photoURL}
                                alt=""
                                height={95}
                                width={95}
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
