import * as React from 'react';
import Modal from 'react-awesome-modal';
import { ShopDto } from "../../rest/ShopsService";
import ShopElement from "./ShopElement";
import { AppState } from "../../redux/reducer/RootReducer";
import { connect } from "react-redux";

interface ShopModalElementProps {
    shop: ShopDto,
    modalVisible: boolean,
    onCloseModal: () => void;

    //global state
    adBlockActive?: boolean
}

interface ShopModalElementState {

}

class ShopModalElement extends React.Component<ShopModalElementProps, ShopModalElementState> {

    constructor(props: Readonly<ShopModalElementProps>) {
        super(props);
        document.addEventListener('keydown', this.escFunction, false);
    }

    escFunction = (event) => {
        if (event.keyCode === 27) {
            this.props.onCloseModal();
        }
    };

    public render() {
        return (
            <React.Fragment>
                <Modal
                    visible={!this.props.adBlockActive && this.props.modalVisible}
                    effect="fadeInUp"
                    onClickAway={this.props.onCloseModal}
                >
                    {this.props.modalVisible && (
                        <ShopElement
                            key={'shop' + this.props.shop.name}
                            onCloseModal={this.props.onCloseModal}
                            shop={this.props.shop}
                        />
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

export default connect(mapStateToProps, null)(ShopModalElement);


