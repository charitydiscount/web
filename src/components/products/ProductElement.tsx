import * as React from "react";
import {InjectedIntlProps} from 'react-intl';
import {FormattedMessage} from 'react-intl';
import {ProductDTO} from "../../rest/ProductsService";
import {Redirect} from "react-router";
import {Routes} from "../helper/Routes";
import {emptyHrefLink} from "../../helper/Constants";

interface ProductElementProps {
    product: ProductDTO,
    onCloseModal: () => void
}

interface ProductElementState {
    redirect: boolean
}

class ProductElement extends React.Component<ProductElementProps & InjectedIntlProps, ProductElementState> {

    constructor(props: Readonly<ProductElementProps>) {
        super(props);
        this.state = {
            redirect: false
        }
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={Routes.CATEGORIES + "/shop/" + this.props.product.shopName}/>;
        }
    };

    public render() {
        return (
            <React.Fragment>
                {this.renderRedirect()}
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
                        <a href={emptyHrefLink} onClick={this.setRedirect} style={{color: "#1641ff"}}>
                            {this.props.product.shopName}
                        </a>
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