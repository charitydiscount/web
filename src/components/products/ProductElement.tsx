import * as React from "react";
import {InjectedIntlProps} from 'react-intl';
import {FormattedMessage} from 'react-intl';
import {ProductDTO} from "../../rest/ProductsService";

interface ProductElementProps {
    product: ProductDTO,
    onCloseModal: () => void
}

interface ProductElementState {

}

class ProductElement extends React.Component<ProductElementProps & InjectedIntlProps, ProductElementState> {

    public render() {
        return (
            <React.Fragment>
                <div className="text-center p-4">
                    <div style={{textAlign: 'right'}}>
                        <i onClick={this.props.onCloseModal} className="fa fa-times"/>
                    </div>
                    {this.props.product.price && <h6 className="blue-color">{this.props.product.price} lei</h6>}
                    <h6>
                        <FormattedMessage
                            id={'product.shop'}
                            defaultMessage="Shop: "
                        />
                        {this.props.product.shopName}
                    </h6>
                    <h6>
                        <FormattedMessage
                            id={'product.cashback.money'}
                            defaultMessage="Saved money: "
                        />
                        {this.props.product.commission} lei
                    </h6>
                    <h6 style={{maxWidth: 300}}>
                        <FormattedMessage
                            id={'shop.category'}
                            defaultMessage="Category: "
                        />
                        {this.props.product.category}
                    </h6>
                    <img style={{maxWidth: 300, maxHeight: 300}} src={this.props.product.imageUrl} alt=""/>
                    <div className="blog_details">
                        <h4 style={{maxWidth: 300}}> {this.props.product.title}</h4>
                        <div className="s_product_text"
                             style={{
                                 marginLeft: 10,
                                 marginTop: 30
                             }}>
                            <div className="card_area">
                                <a
                                    href={this.props.product.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="main_btn"
                                >
                                    <FormattedMessage
                                        id={'shop.access.button'}
                                        defaultMessage="Access"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default ProductElement;