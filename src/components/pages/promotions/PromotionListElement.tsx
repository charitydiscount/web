import React from "react";
import { PromotionDto } from "../../../rest/DealsService";
import PromotionModalElement from "./PromotionModalElement";

interface PromotionListElementState {
    promotionModalVisible: boolean;
}

interface PromotionListElementProps {
    promotion: PromotionDto;
}

class PromotionListElement extends React.Component<PromotionListElementProps, PromotionListElementState> {

    state = {
        promotionModalVisible: false
    };

    closeModal = () => {
        this.setState({
            promotionModalVisible: false
        });
    };

    openModal = () => {
        this.setState({
            promotionModalVisible: true
        });
    };

    public render() {
        return (
            <React.Fragment>
                <PromotionModalElement
                    promotion={this.props.promotion}
                    modalVisible={this.state.promotionModalVisible}
                    onCloseModal={this.closeModal}
                />
                <div
                    className="col-md-4 shop-container"
                    onClick={this.openModal}
                    style={{cursor: 'pointer'}}
                >
                    <div className="f_p_item shop">
                        <div className="shop-image-container">
                            <div
                                className="shop-image"
                                style={{
                                    maxWidth: 200,
                                    maxHeight: 200,
                                    backgroundImage:
                                        'url(' + this.props.promotion.campaignLogo + ')',
                                }}
                            />
                        </div>
                        <div style={{
                            padding: 5,
                            overflow: 'auto'
                        }} className="shop-description-container">
                            <h6 className="comission">
                                {this.props.promotion.name}
                            </h6>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default PromotionListElement;