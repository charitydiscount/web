import * as React from 'react';
import {PromotionDTO} from "../../rest/DealsService";

interface PromotionProps {
    promotion: PromotionDTO
    comingFromShopReview?: boolean
}

interface PromotionState {

}

class Promotion extends React.Component<PromotionProps, PromotionState> {

    public render() {
        return (
            <React.Fragment>
                <tr>
                    <td>
                        <p style={!this.props.comingFromShopReview ? {maxWidth: 300} : {}}>{this.props.promotion.name}</p>
                    </td>
                </tr>
            </React.Fragment>
        );
    }
}

export default Promotion;
