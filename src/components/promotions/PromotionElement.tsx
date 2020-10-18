import { emptyHrefLink, StorageKey } from '../../helper/Constants';
import * as React from 'react';
import { ShopDto } from '../../rest/ShopsService';
import { injectIntl, IntlShape } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { PromotionDto } from '../../rest/DealsService';
import { AppState } from '../../redux/reducer/RootReducer';
import { connect } from 'react-redux';
import { getLocalStorage } from '../../helper/StorageHelper';
import { computeUrl } from '../../helper/AppHelper';
import { clickSaveAndRedirect } from "../../rest/ClickService";
import RedirectModal from "../shops/RedirectModal";

interface PromotionElementProps {
    promotion: PromotionDto,
    allShops: ShopDto[],
    onCloseModal?: () => void;
    intl: IntlShape;
}

interface PromotionElementState {
    redirectModalVisible: boolean;
}

class PromotionElement extends React.Component<PromotionElementProps, PromotionElementState> {

    constructor(props: PromotionElementProps) {
        super(props);
        this.state = {
            redirectModalVisible: false
        };
    }

    openRedirectModal = () => {
        this.setState({
            redirectModalVisible: true
        });
    };

    closeRedirectModal = () => {
        this.setState({
            redirectModalVisible: false
        });
    };

    public render() {
        let accessButton;
        let shop = this.props.allShops.find(
            shop => shop.id === this.props.promotion.program.id
        );
        let cashbackUrl;
        if (shop) {
            cashbackUrl = computeUrl(
                this.props.promotion.affiliateUrl,
                shop.uniqueCode,
                this.props.promotion.landingPageLink
            );
        }

        let redirectStorageKey = getLocalStorage(StorageKey.REDIRECT_MESSAGE);
        if (redirectStorageKey && redirectStorageKey === 'true') {
            accessButton = (
                <a
                    href={emptyHrefLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="main_btn"
                    onClick={(event) => {
                        clickSaveAndRedirect(event, this.props.promotion.program.id, cashbackUrl)
                    }}
                >
                    <FormattedMessage
                        id={'shop.access.button'}
                        defaultMessage="Access"
                    />
                </a>
            );
        } else {
            accessButton = (
                <a
                    href={emptyHrefLink}
                    rel="noopener noreferrer"
                    className="main_btn"
                    onClick={this.openRedirectModal}
                >
                    <FormattedMessage
                        id={'shop.access.button'}
                        defaultMessage="Access"
                    />
                </a>
            );
        }

        let promotionEnd = new Date(this.props.promotion.promotionEnd);
        let Difference_In_Days = Math.ceil((promotionEnd.getTime() - Date.now()) / (1000 * 3600 * 24));

        return (
            <React.Fragment>
                <RedirectModal
                    visible={this.state.redirectModalVisible}
                    programId={this.props.promotion.program.id}
                    onCloseModal={this.closeRedirectModal}
                    cashbackUrl={cashbackUrl}
                />
                <div className="text-center p-4">
                    <div style={{textAlign: 'right'}}>
                        <i
                            onClick={this.props.onCloseModal}
                            className="fa fa-times"
                        />
                    </div>

                    <h4 className="cashback-text" style={{marginBottom: 15}}>
                        <FormattedMessage
                            id={'promotions.expires.in'}
                            defaultMessage="Expira in"
                        />
                        <span className="blue-color">{Difference_In_Days}</span>
                        <FormattedMessage
                            id={'promotions.expires.in.days'}
                            defaultMessage=" zile"
                        />
                        <br/>
                    </h4>
                    <img
                        src={this.props.promotion.campaignLogo}
                        alt=""
                        style={{
                            maxWidth: 200,
                            maxHeight: 200,
                        }}
                    />
                    <div className="blog_details">
                        <h4 style={{maxWidth: 300, maxHeight: 150}}>{this.props.promotion.name}</h4>
                        <h6 style={{maxWidth: 300, maxHeight: 250, overflow: 'auto'}}>
                            {this.props.promotion.description}
                        </h6>
                        <div
                            className="s_product_text"
                            style={{marginTop: 20, marginBottom: 20}}
                        >
                            <div className="card_area p_20"
                                 style={{
                                     marginLeft: 15
                                 }}>
                                {accessButton}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        allShops: state.shops.allShops
    };
};

export default connect(mapStateToProps)(injectIntl(PromotionElement));
