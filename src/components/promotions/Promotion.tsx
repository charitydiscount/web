import * as React from 'react';
import { connect } from 'react-redux';
import { PromotionDTO } from '../../rest/DealsService';
import { ShopDto } from '../../rest/ShopsService';
import { computeUrl } from '../../helper/AppHelper';

interface PromotionProps {
    promotion: PromotionDTO;
    comingFromShopReview?: boolean;
}

interface StateProps {
    shops: ShopDto[];
}

type Props = PromotionProps & StateProps;

class Promotion extends React.Component<Props> {
    public render() {
        const shop = this.props.shops.find(
            shop => shop.id === this.props.promotion.program.id
        );
        let computedPromotionUrl: string | undefined;
        if (shop) {
            computedPromotionUrl = computeUrl(this.props.promotion.affiliateUrl, shop.uniqueCode,
                this.props.promotion.landingPageLink);
        }

        return (
            <React.Fragment>
                <tr>
                    <td>
                        {computedPromotionUrl && (
                            <a
                                href={computedPromotionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={
                                    !this.props.comingFromShopReview
                                        ? { maxWidth: 300 }
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
                                        ? { maxWidth: 300 }
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
    };
};

export default connect(mapStateToProps)(Promotion);
