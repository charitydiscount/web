import React from "react";
import ProductElement from "./ProductElement";
import { Product, ProductHistoryScale } from "../../../rest/ProductsService";
import { AppState } from "../../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { ResponsiveLine } from '@nivo/line'
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { spinnerCss } from "../../../helper/AppHelper";
import { ShopDto } from "../../../rest/ShopsService";
import { filterProducts } from "./ProductHelper";

interface ProductInfoProps {
    product: Product
    shops: ShopDto[],
    chartData: ProductHistoryScale[],
    similarProducts: Product[],
    isLoadingHistory: boolean,
    isLoadingSimilar: boolean,
    backLink: string
}

const ProductInfo = (props: ProductInfoProps) => {

    window.scrollTo(0, 0);
    let maxYScaleValue = 0;
    if (props.chartData && props.chartData.length > 0) {
        let max = 0;
        props.chartData.forEach(value => {
            if (Number(value.y) > max) {
                max = Number(value.y)
            }
        });
        max = max + (max * 50) / 100;
        maxYScaleValue = max;
    }

    let productsList;
    if (props.similarProducts && props.similarProducts.length > 0) {
        productsList = filterProducts(props.similarProducts, props.shops, false);
    }

    return (
        <React.Fragment>
            <section className={'product_description_area'}>
                <div className={'container'}>
                    <div className="row" style={{marginTop: 70}}>
                        <div className="col-lg-1" style={{maxWidth: 1}}>
                            <Link to={props.backLink} className="increase_clickable_area">
                                <i className="fa fa-arrow-left"
                                   style={{marginTop: 30, fontSize: 30, color: "red"}}/>
                            </Link>
                        </div>
                        <div className="col-lg-5">
                            <ProductElement product={props.product}
                                            productInfo={true}/>
                        </div>
                        <div className="col-lg-6" style={{maxHeight: 400}}>
                            <div className="text-center" style={{padding: "30px 30px 0px 30px"}}>
                                <h3>
                                    <FormattedMessage
                                        id={'product.info.history.price.title'}
                                        defaultMessage="Evolutia pretului"
                                    />
                                </h3>
                            </div>
                            <FadeLoader
                                loading={props.isLoadingHistory}
                                color={'#e31f29'}
                                css={spinnerCss}
                            />
                            {!props.isLoadingHistory &&
                            <React.Fragment>
                                {props.chartData && props.chartData.length > 0 ?
                                    <ResponsiveLine
                                        data={[
                                            {
                                                "id": "product_history",
                                                "color": "hsl(5, 70%, 50%)",
                                                "data": props.chartData
                                            }
                                        ]}
                                        margin={{top: 10, right: 50, bottom: 80, left: 50}}
                                        xScale={{format: "%Y-%m-%dT%H:%M:%S.%L%Z", type: "time"}}
                                        yScale={{
                                            type: 'linear',
                                            min: 0,
                                            max: maxYScaleValue,
                                            stacked: true,
                                            reverse: false
                                        }}
                                        xFormat="time:%Y-%m-%d"
                                        yFormat=" >-.2f"
                                        axisTop={null}
                                        enableGridX={false}
                                        axisRight={null}
                                        axisBottom={{
                                            tickValues: "every 8 days",
                                            tickRotation: 45,
                                            tickSize: 5,
                                            tickPadding: 5,
                                            format: "%Y-%m-%d"
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
                                    : <div style={{padding: 30}}>
                                        <FormattedMessage
                                            id={'product.info.history.price.no.data.available'}
                                            defaultMessage="Nu sunt date"
                                        />
                                    </div>
                                }
                            </React.Fragment>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <FadeLoader
                            loading={props.isLoadingSimilar}
                            color={'#e31f29'}
                            css={spinnerCss}
                        />
                        {!props.isLoadingSimilar &&
                        <React.Fragment>
                            <div className="text-center" style={{padding: "30px 30px 0px 30px"}}>
                                <h3>
                                    <FormattedMessage
                                        id={'product.info.similar.products.title'}
                                        defaultMessage="Produse similare"
                                    />
                                </h3>
                            </div>
                            <div
                                className="latest_product_inner row d-flex align-items-stretch shops-container shade-container">
                                {productsList}
                            </div>
                        </React.Fragment>
                        }
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}

const mapStateToProps = (state: AppState) => {
    return {
        product: state.product.currentProduct,
        shops: state.shops.allShops,
        chartData: state.product.productHistory,
        similarProducts: state.product.similarProducts,
        isLoadingHistory: state.product.historyLoading,
        isLoadingSimilar: state.product.similarLoading,
        backLink: state.product.backLink
    };
};

export default connect(mapStateToProps, null)(ProductInfo);

