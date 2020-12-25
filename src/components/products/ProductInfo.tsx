import React from "react";
import ProductElement from "./ProductElement";
import { Product } from "../../rest/ProductsService";
import { AppState } from "../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";


interface ProductInfoProps {
    product: Product
}

interface ProductInfoState {

}

class ProductInfo extends React.Component<ProductInfoProps, ProductInfoState> {

    public render() {
        return (
            <React.Fragment>
                <section className={'product_description_area'}>
                    <div className={'container'}>
                        <div className="row" style={{marginTop: 70}}>
                            <div className="col-lg-6">
                                <ProductElement product={this.props.product} productInfo={true}/>
                            </div>
                            <div className="col-lg-6">
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        product: state.product.currentProduct
    };
};

export default connect(mapStateToProps, null)(injectIntl(ProductInfo));

