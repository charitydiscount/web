import * as React from 'react';
import { ShopDto } from '../../rest/ShopsService';
import { injectIntl, IntlShape } from 'react-intl';
import ShopElement from './ShopElement';
import { AppState } from '../../redux/reducer/RootReducer';
import { connect } from 'react-redux';
import ShopModalElement from './ShopModalElement';

interface ShopListElementState {
    shopModalVisible: boolean;
}

interface ShopListElementProps {
    shop: ShopDto;
    intl: IntlShape;
}

class ShopListElement extends React.Component<
    ShopListElementProps,
    ShopListElementState
> {
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
                <ShopModalElement
                    shop={this.props.shop}
                    modalVisible={this.state.shopModalVisible}
                    onCloseModal={this.closeModal}
                />
                <div
                    className="col-md-4 col-xl-3 col-sm-6 shop-container f_p_item p-2"
                    onClick={this.openModal}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="f_p_item shop">
                        <div className="shop-image-container">
                            <div
                                className="shop-image"
                                style={{
                                    backgroundImage:
                                        'url(' + this.props.shop.logoPath + ')',
                                }}
                            ></div>
                        </div>
                        <div className="shop-description-container">
                            <h6 className="comission">
                                {this.props.shop.uiCommission}
                            </h6>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default injectIntl(ShopListElement);
