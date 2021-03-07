import * as React from 'react';
import { connect } from 'react-redux';
import { PromotionDto } from '../../../rest/DealsService';
import { ShopDto } from '../../../rest/ShopsService';
import { computeUrl } from '../../../helper/AppHelper';
import { clickSaveAndRedirect } from "../../../rest/ClickService";
import { emptyHrefLink } from "../../../helper/Constants";

interface PromotionProps {
    promotion: PromotionDto;
    comingFromShopReview?: boolean;
    isLoggedIn: boolean
}

interface StateProps {
    shops: ShopDto[];
}

type Props = PromotionProps & StateProps;

const ShopPromotion = (props: Props) => {

    const shop = props.shops.find(
        shop => shop.id.toString() === props.promotion.program.id.toString()
    );
    let computedPromotionUrl;
    if (shop && props.isLoggedIn) {
        computedPromotionUrl = computeUrl(props.promotion.affiliateUrl, shop.uniqueCode,
            props.promotion.landingPageLink);
    }

    return (
        <React.Fragment>
            <tr>
                <td>
                    {computedPromotionUrl && (
                        <a
                            href={emptyHrefLink}
                            onClick={(event) => {
                                clickSaveAndRedirect(event, props.promotion.program.id, computedPromotionUrl)
                            }}
                            rel="noopener noreferrer"
                            style={
                                !props.comingFromShopReview
                                    ? {maxWidth: 300}
                                    : {}
                            }
                        >
                            {props.promotion.name}
                        </a>
                    )}
                    {!computedPromotionUrl && (
                        <p
                            style={
                                !props.comingFromShopReview
                                    ? {maxWidth: 300}
                                    : {}
                            }
                        >
                            {props.promotion.name}
                        </p>
                    )}
                </td>
            </tr>
        </React.Fragment>
    );
}

const mapStateToProps = (state: any) => {
    return {
        shops: state.shops.allShops,
        isLoggedIn: state.user.isLoggedIn
    };
};

export default connect(mapStateToProps)(ShopPromotion);
