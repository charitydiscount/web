import * as React from "react";
import {ProductDTO} from "../../rest/ProductsService";
import Modal from 'react-awesome-modal';
import ProductElement from "./ProductElement";

interface ProductListElementState {
    visible: boolean
}

interface ProductListElementProps {
    keyElement: string
    product: ProductDTO
}

class ProductListElement extends React.Component<ProductListElementProps, ProductListElementState> {

    constructor(props: ProductListElementProps) {
        super(props);
        this.state = {
            visible: false
        };
        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event){
        if(event.keyCode === 27) {
            this.closeModal();
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
    }

    closeModal() {
        this.setState({
            visible: false,
        });
    }

    openModal() {
        this.setState({
            visible: true,
        });
    }

    public render() {
        return (
            <React.Fragment>
                <Modal visible={this.state.visible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    {this.state.visible &&
                    <ProductElement key={"element" + this.props.keyElement} product={this.props.product}/>}
                </Modal>
                <div className="col-md-3">
                    <div className="f_p_item">
                        <div onClick={() => this.openModal()} style={{cursor: 'pointer'}}>
                            {this.props.product.price && <h6 className="blue-color">{this.props.product.price} lei</h6>}
                            <div className="f_p_img">
                                <img
                                    className="img-fluid img-min img"
                                    style={{
                                        maxWidth: 200,
                                        maxHeight: 200
                                    }}
                                    src={this.props.product.imageUrl}
                                    alt=""
                                />
                            </div>
                            <h4>{this.props.product.title}</h4>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ProductListElement;
