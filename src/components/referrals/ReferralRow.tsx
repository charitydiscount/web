import { injectIntl, IntlShape } from "react-intl";
import * as React from "react";
import { ReferralDto } from "../../rest/ReferralService";
import { loadUserIdPhoto, UserPhotoState } from "../login/UserPhotoHelper";

interface ReferralRowState extends UserPhotoState {

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
            isLoadingPhoto: false
        };
    }

    async componentDidMount() {
        await loadUserIdPhoto(this, this.props.referral.photoUrl, this.props.referral.userId);
    }

    public render() {
        return (
            <React.Fragment>
                <div
                    className="col-md-3 col-sm-6 f_p_item p-2"
                    style={{cursor: 'pointer'}}
                >
                    <h6 className="blue-color">
                        0.0
                    </h6>
                    <div className="f_p_img d-flex">
                        {!this.state.isLoadingPhoto && (
                            <img
                                className="author_img rounded-circle"
                                src={this.state.photoURL}
                                alt=""
                                height={200}
                                width={200}
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
