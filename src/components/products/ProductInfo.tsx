import React from "react";
import ProductElement from "./ProductElement";
import { getProductPriceHistory, Product } from "../../rest/ProductsService";
import { AppState } from "../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { injectIntl, IntlShape } from "react-intl";
import { ResponsiveLine } from '@nivo/line'
import {Link} from "react-router-dom";

interface ProductInfoProps {
    product: Product,
    intl: IntlShape;
}

interface ProductInfoState {

}

class ProductInfo extends React.Component<ProductInfoProps, ProductInfoState> {

    async componentDidMount() {
        await getProductPriceHistory(this.props.product.url);
    }

    public render() {
        return (
            <React.Fragment>
                <section className={'product_description_area'}>
                    <div className={'container'}>
                        <div className="row" style={{marginTop: 70}}>
                            <div className="col-lg-1" style={{maxWidth: 1}}>
                                <Link to={"/products"} className="increase_clickable_area" >
                                    <i className="fa fa-arrow-left" style={{marginTop:30, fontSize:30}}/>
                                </Link>
                            </div>
                            <div className="col-lg-5">
                                <ProductElement product={this.props.product}
                                                productInfo={true}/>
                            </div>
                            <div className="col-lg-6" style={{maxHeight: 400}}>
                                <ResponsiveLine
                                    data={[
                                        {
                                            "id": "japan",
                                            "color": "hsl(5, 70%, 50%)",
                                            "data": [
                                                {
                                                    "x": "plane",
                                                    "y": 292
                                                },
                                                {
                                                    "x": "helicopter",
                                                    "y": 298
                                                },
                                                {
                                                    "x": "boat",
                                                    "y": 54
                                                },
                                                {
                                                    "x": "train",
                                                    "y": 93
                                                },
                                                {
                                                    "x": "subway",
                                                    "y": 200
                                                },
                                                {
                                                    "x": "bus",
                                                    "y": 139
                                                },
                                                {
                                                    "x": "car",
                                                    "y": 266
                                                },
                                                {
                                                    "x": "moto",
                                                    "y": 146
                                                },
                                                {
                                                    "x": "bicycle",
                                                    "y": 220
                                                },
                                                {
                                                    "x": "horse",
                                                    "y": 246
                                                },
                                                {
                                                    "x": "skateboard",
                                                    "y": 30
                                                },
                                                {
                                                    "x": "others",
                                                    "y": 94
                                                }
                                            ]
                                        }
                                    ]}
                                    margin={{top: 50, right: 50, bottom: 50, left: 50}}
                                    xScale={{type: 'point'}}
                                    yScale={{type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false}}
                                    yFormat=" >-.2f"
                                    axisTop={null}
                                    enableGridX={false}
                                    axisRight={null}
                                    axisBottom={{
                                        orient: 'bottom',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                    }}
                                    axisLeft={{
                                        orient: 'left',
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                    }}
                                    enablePoints={false}
                                    useMesh={false}
                                />
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

