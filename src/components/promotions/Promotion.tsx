import * as React from 'react';
import {PromotionDTO} from "../../rest/DealsService";
import {getShopById} from "../../rest/ShopsService";
import {computeUrl} from "../../helper/AppHelper";

interface PromotionProps {
    promotion: PromotionDTO
    comingFromShopReview?: boolean
}

interface PromotionState {

}

class Promotion extends React.Component<PromotionProps, PromotionState> {

    public render() {
        let shop = getShopById(this.props.promotion.program.id);
        let computedPromotionUrl;
        if (shop && shop.uniqueCode) {
            computedPromotionUrl = computeUrl(shop.uniqueCode, this.props.promotion.landingPageLink);
        }

        return (
            <React.Fragment>
                <tr>
                    <td>
                        {computedPromotionUrl &&
                        <a href={computedPromotionUrl} target="_blank" rel="noopener noreferrer"
                           style={!this.props.comingFromShopReview ? {maxWidth: 300} : {}}>{this.props.promotion.name}</a>
                        }
                        {!computedPromotionUrl &&
                        <p style={!this.props.comingFromShopReview ? {maxWidth: 300} : {}}>{this.props.promotion.name}</p>
                        }
                    </td>
                </tr>
            </React.Fragment>
        );
    }
}

export default Promotion;
