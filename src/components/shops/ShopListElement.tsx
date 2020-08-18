import * as React from 'react';
import { ShopDto } from '../../rest/ShopsService';
import { injectIntl, IntlShape } from 'react-intl';
import ShopModalElement from "./ShopModalElement";

interface ShopListElementState {
    shopModalVisible: boolean;
}

interface ShopListElementProps {
    shop: ShopDto;
    intl: IntlShape;
}

class ShopListElement extends React.Component<ShopListElementProps, ShopListElementState> {

    constructor(props: ShopListElementProps) {
        super(props);
        this.state = {
            shopModalVisible: false,
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.setState({
            shopModalVisible: false,
        });
    }

    openModal() {
        this.setState({
            shopModalVisible: true,
        });
    }

    public render() {
        return (
            <React.Fragment>
                <ShopModalElement shop={this.props.shop}
                                  modalVisible={this.state.shopModalVisible}
                                  onCloseModal={this.closeModal}/>
                <div
                    className="col-md-3 col-sm-6 f_p_item p-2"
                    onClick={this.openModal}
                    style={{cursor: 'pointer'}}
                >
                    <h6 className="blue-color">
                        {this.props.shop.uiCommission}
                    </h6>
                    <div className="f_p_img d-flex">
                        <img
                            className="img-fluid img-min img align-self-center"
                            src={this.props.shop.logoPath}
                            alt=""
                        />
                    </div>
                    <h4>{this.props.shop.name}</h4>
                </div>
            </React.Fragment>
        );
    }
}

export default injectIntl(ShopListElement);
