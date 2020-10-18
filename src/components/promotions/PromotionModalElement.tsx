import * as React from 'react';
import Modal from 'react-awesome-modal';
import { AppState } from "../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import PromotionElement from "./PromotionElement";
import { PromotionDto } from "../../rest/DealsService";

interface PromotionModalElementProps {
    promotion: PromotionDto,
    modalVisible: boolean,
    onCloseModal: () => void;

    //global state
    adBlockActive?: boolean
}

interface PromotionModalElementState {

}

class PromotionModalElement extends React.Component<PromotionModalElementProps, PromotionModalElementState> {

    escFunction = (event) => {
        if (event.keyCode === 27) {
            this.props.onCloseModal();
        }
    };

    componentDidMount() {
        document.addEventListener('keydown', this.escFunction, false);
    }

    public render() {
        return (
            <React.Fragment>
                <Modal
                    visible={!this.props.adBlockActive && this.props.modalVisible}
                    effect="fadeInUp"
                    onClickAway={this.props.onCloseModal}
                >
                    {this.props.modalVisible && (
                        <PromotionElement
                            key={'shop' + this.props.promotion.name}
                            promotion={this.props.promotion}
                            onCloseModal={this.props.onCloseModal}/>
                    )}
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        adBlockActive: state.adBlock.isActive,
    };
};

export default connect(mapStateToProps)(PromotionModalElement);


