import * as React from 'react';
import { ShopDto } from '../../../rest/ShopsService';
import ShopModalElement from './ShopModalElement';

interface ShopListElementState {
    shopModalVisible: boolean;
}

interface ShopListElementProps {
    shop: ShopDto;
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
    }

    closeModal = () => {
        this.setState({
            shopModalVisible: false,
        });
    };

    openModal = () => {
        this.setState({
            shopModalVisible: true,
        });
    };

    public render() {
        return (
            <React.Fragment>
                <ShopModalElement
                    shop={this.props.shop}
                    modalVisible={this.state.shopModalVisible}
                    onCloseModal={this.closeModal}
                />
                <div
                    className="col-md-4 col-xl-3 col-sm-6 shop-container"
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
                            />
                            <h5>{this.props.shop.name}</h5>
                        </div>
                        <div className="shop-description-container">
                            <h6 className="comission" style={{marginTop:8}}>
                                {this.props.shop.uiCommission}
                            </h6>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ShopListElement;
