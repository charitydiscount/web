import * as React from 'react';
import { connect } from 'react-redux';
import { PromotionDto } from '../../rest/DealsService';
import { ShopDto } from '../../rest/ShopsService';
import { computeUrl } from '../../helper/AppHelper';
import { clickSaveAndRedirect } from "../../rest/ClickService";
import { emptyHrefLink } from "../../helper/Constants";

interface PromotionProps {
    promotion: PromotionDto;
    comingFromShopReview?: boolean;
    isLoggedIn: boolean
}

interface StateProps {
    shops: ShopDto[];
}

type Props = PromotionProps & StateProps;

class ShopPromotion extends React.Component<Props> {

    public render() {
        const shop = this.props.shops.find(
            shop => shop.id === this.props.promotion.program.id
        );
        let computedPromotionUrl;
        if (shop && this.props.isLoggedIn) {
            computedPromotionUrl = computeUrl(this.props.promotion.affiliateUrl, shop.uniqueCode,
                this.props.promotion.landingPageLink);
        }

        return (
            <React.Fragment>
                <tr>
                    <td>
                        {computedPromotionUrl && (
                            <a
                                href={emptyHrefLink}
                                onClick={(event) => {
                                    clickSaveAndRedirect(event, this.props.promotion.program.id, computedPromotionUrl)
                                }}
                                rel="noopener noreferrer"
                                style={
                                    !this.props.comingFromShopReview
                                        ? {maxWidth: 300}
                                        : {}
                                }
                            >
                                {this.props.promotion.name}
                            </a>
                        )}
                        {!computedPromotionUrl && (
                            <p
                                style={
                                    !this.props.comingFromShopReview
                                        ? {maxWidth: 300}
                                        : {}
                                }
                            >
                                {this.props.promotion.name}
                            </p>
                        )}
                    </td>
                </tr>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        shops: state.shops.allShops,
        isLoggedIn: state.user.isLoggedIn
    };
};

export default connect(mapStateToProps)(ShopPromotion);
