import React from "react";
import ProductElement from "./ProductElement";
import { getProductPriceHistory, Product, ProductHistoryScale } from "../../rest/ProductsService";
import { AppState } from "../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl, IntlShape } from "react-intl";
import { ResponsiveLine } from '@nivo/line'
import { Link } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { spinnerCss } from "../../helper/AppHelper";

interface ProductInfoProps {
    product: Product,
    intl: IntlShape;
}

interface ProductInfoState {
    chartData: ProductHistoryScale[],
    isLoadingHistory: boolean
}

class ProductInfo extends React.Component<ProductInfoProps, ProductInfoState> {


    constructor(props: ProductInfoProps) {
        super(props);
        this.state = {
            chartData: [],
            isLoadingHistory: true
        }
    }

    async componentDidMount() {
        try {
            let response = await getProductPriceHistory(this.props.product.aff_code);
            if (response) {
                this.setState({
                    chartData: response as ProductHistoryScale[],
                    isLoadingHistory: false
                })
            } else {
                this.setState({
                    isLoadingHistory: false
                });
            }
        } catch (e) {
            //no chart data
            this.setState({
                isLoadingHistory: false
            });
        }
    }

    public render() {
        let maxYScaleValue = 0;
        if (this.state.chartData && this.state.chartData.length > 0) {
            let max = 0;
            this.state.chartData.forEach(value => {
                if (Number(value.y) > max) {
                    max = Number(value.y)
                }
            });
            max = max + (max * 50) / 100;
            maxYScaleValue = max;
        }
        return (
            <React.Fragment>
                <section className={'product_description_area'}>
                    <div className={'container'}>
                        <div className="row" style={{marginTop: 70}}>
                            <div className="col-lg-1" style={{maxWidth: 1}}>
                                <Link to={"/products"} className="increase_clickable_area">
                                    <i className="fa fa-arrow-left" style={{marginTop: 30, fontSize: 30}}/>
                                </Link>
                            </div>
                            <div className="col-lg-5">
                                <ProductElement product={this.props.product}
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
                                    loading={this.state.isLoadingHistory}
                                    color={'#e31f29'}
                                    css={spinnerCss}
                                />
                                {!this.state.isLoadingHistory &&
                                <React.Fragment>
                                    {this.state.chartData && this.state.chartData.length > 0 ?
                                        <ResponsiveLine
                                            data={[
                                                {
                                                    "id": "product_history",
                                                    "color": "hsl(5, 70%, 50%)",
                                                    "data": this.state.chartData
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

