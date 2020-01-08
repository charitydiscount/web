import * as React from 'react';
import Modal from 'react-awesome-modal';
import {ShopDto} from '../../rest/ShopsService';
import {InjectedIntlProps, injectIntl} from 'react-intl';
import ShopElement from "./ShopElement";

interface ShopListElementState {
    visible: boolean
}

interface ShopListElementProps {
    shop: ShopDto
}

class ShopListElement extends React.Component<ShopListElementProps & InjectedIntlProps, ShopListElementState> {

    constructor(props: ShopListElementProps) {
        super(props);
        this.state = {
            visible: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }

    closeModal() {
        this.setState({
            visible: false,
        });
    }

    openModal() {
        this.setState({
            visible: true,
        });
    }

    public render() {
        return (
            <React.Fragment>
                <Modal
                    visible={this.state.visible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    {this.state.visible && <ShopElement key={"shop" + this.props.shop.name} onCloseModal={this.closeModal}
                                                        shop={this.props.shop}/>}
                </Modal>
                <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="f_p_item">
                        <div
                            onClick={() => this.openModal()}
                            style={{cursor: 'pointer'}}
                        >
                            <h6 className="blue-color">{this.props.shop.uiCommission}</h6>
                            <div className="f_p_img">
                                <img
                                    className="img-fluid img-min img"
                                    src={this.props.shop.logoPath}
                                    alt=""
                                />
                            </div>
                            <h4>{this.props.shop.name}</h4>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default injectIntl(ShopListElement);
