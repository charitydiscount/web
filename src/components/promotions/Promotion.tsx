import * as React from 'react';
import {PromotionDTO} from "../../rest/DealsService";

interface PromotionProps {
    promotion: PromotionDTO
}

interface PromotionState {

}

class Promotion extends React.Component<PromotionProps, PromotionState> {

    public render() {
        return (
            <React.Fragment>
                <tr>
                    <td>
                        <p style={{maxWidth: 300}}>{this.props.promotion.name} - {this.props.promotion.description}</p>
                    </td>
                </tr>
            </React.Fragment>
        );
    }
}

export default Promotion;
