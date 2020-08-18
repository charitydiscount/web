import * as React from 'react';
import Modal from 'react-awesome-modal';
import { ShopDto } from "../../rest/ShopsService";
import ShopElement from "./ShopElement";

interface ShopModalElementProps {
    shop: ShopDto,
    modalVisible: boolean,

    onCloseModal: () => void;
}

interface ShopModalElementState {

}

class ShopModalElement extends React.Component<ShopModalElementProps, ShopModalElementState> {

    constructor(props: ShopModalElementProps) {
        super(props);
        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.props.onCloseModal();
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.escFunction, false);
    }

    public render() {
        return (
            <React.Fragment>
                <Modal
                    visible={this.props.modalVisible}
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


export default ShopModalElement;

