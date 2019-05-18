import * as React from "react";
import Modal from 'react-awesome-modal';

interface IProductInfoState {
    visible: boolean;
}

interface IProductProps {
    logoSrc: string,
    name: string
}

class Shop extends React.Component<IProductProps, IProductInfoState> {

    constructor(props: IProductProps) {
        super(props);
        this.state = {
            visible: false
        };
    }

    closeModal() {
        this.setState({
            visible: false
        });
    }

    openModal() {
        this.setState({
            visible: true
        });
    }


    public render() {
        return (
            <React.Fragment>
                <Modal visible={this.state.visible} width="1024" height="550" effect="fadeInUp"
                       onClickAway={() => this.closeModal()}>
                    <div className="product_image_area">
                        <div className="container">
                            <div className="row s_product_inner">
                                <div className="col-lg-5 offset-lg-1">
                                    <div className="s_product_text">
                                        <h3>Faded SkyBlu Denim Jeans</h3>
                                        <ul className="list">
                                            <li>
                                                <a className="active" href="#">
                                                    <span>Category</span> : Household</a>
                                            </li>
                                        </ul>
                                        <p>Mill Oil is an innovative oil filled radiator with the most modern
                                            technology. If
                                            you
                                            are looking
                                            for something that
                                            can make your interior look awesome, and at the same time give you the
                                            pleasant
                                            warm
                                            feeling   can make your interior look awesome, and at the same time give you the
                                            pleasant
                                            warm
                                            feeling    can make your interior look awesome, and at the same time give you the
                                            pleasant
                                        </p>
                                        <div className="card_area">
                                            <a className="main_btn" href="#">Access</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="s_product_img">
                                        <img className="d-block w-100" width={300} height={500}
                                             src="img/product/single-product/s-product-1.jpg"
                                             alt="Third slide"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="f_p_item">
                        <a href="javascript:void(0);" onClick={() => this.openModal()}>
                            <div className="f_p_img">
                                <img className="img-fluid" src={this.props.logoSrc} alt="" />
                            </div>
                            <h4>{this.props.name}</h4>
                        </a>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Shop;