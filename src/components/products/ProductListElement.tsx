import * as React from 'react';
import { ProductDTO } from '../../rest/ProductsService';
import Modal from 'react-awesome-modal';
import ProductElement from './ProductElement';
import { injectIntl, IntlShape } from 'react-intl';

interface ProductListElementState {
    visible: boolean;
}

interface ProductListElementProps {
    intl: IntlShape;
    keyElement: string;
    product: ProductDTO;
}

class ProductListElement extends React.Component<ProductListElementProps,
    ProductListElementState> {
    constructor(props: ProductListElementProps) {
        super(props);
        this.state = {
            visible: false
        };
        document.addEventListener('keydown', this.escFunction, false);
    }

    escFunction = (event) => {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    };

    closeModal = () => {
        this.setState({
            visible: false
        });
    };

    openModal = () => {
        this.setState({
            visible: true
        });
    };

    public render() {
        return (
            <React.Fragment>
                <Modal
                    visible={this.state.visible}
                    effect="fadeInUp"
                    onClickAway={this.closeModal}
                >
                    <ProductElement
                        key={'element' + this.props.keyElement}
                        onCloseModal={this.closeModal}
                        product={this.props.product}
                    />
                </Modal>
                <div
                    className="col-md-4 shop-container"
                    onClick={this.openModal}
                    style={{cursor: 'pointer'}}
                >
                    <div className="f_p_item shop" style={{height: 230}}>
                        {this.props.product.price && (
                            <h6 className="comission blue-color" style={{marginTop: 5}}>
                                {this.props.product.price} lei
                            </h6>
                        )}
                        <div className="shop-image-container" style={{marginBottom: 0, padding: 0}}>
                            <div
                                className="shop-image"
                                style={{backgroundImage: 'url("' + this.props.product.imageUrl + '")'}}
                            />
                        </div>
                        <div className="shop-description-container"
                             style={{overflow: 'auto', padding: 0, maxHeight: 90}}>
                            <h4 className="comission">
                                {this.props.product.title}
                            </h4>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default injectIntl(ProductListElement);
