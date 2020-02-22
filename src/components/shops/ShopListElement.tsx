import * as React from 'react';
import Modal from 'react-awesome-modal';
import { ShopDto } from '../../rest/ShopsService';
import { injectIntl, IntlShape } from 'react-intl';
import ShopElement from './ShopElement';
import { AppState } from "../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { setCurrentShop } from "../../redux/actions/ShopsAction";

interface ShopListElementState {
    visible: boolean;
}

interface ShopListElementProps {
    shop: ShopDto;
    intl: IntlShape;

    //global state
    currentShop: string;
    setCurrentShop: any;
}

class ShopListElement extends React.Component<ShopListElementProps,
    ShopListElementState> {
    constructor(props: ShopListElementProps) {
        super(props);
        this.state = {
            visible: false,
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.escFunction, false);
        if (this.props.shop.uniqueCode === this.props.currentShop) {
            this.openModal();
        }
    }

    closeModal() {
        this.setState({
            visible: false,
        });
        this.props.setCurrentShop('');
    }

    openModal() {
        this.setState({
            visible: true,
        });
    }

    public render() {
        return (
            <React.Fragment>
                <Modal
                    visible={this.state.visible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    {this.state.visible && (
                        <ShopElement
                            key={'shop' + this.props.shop.name}
                            onCloseModal={this.closeModal}
                            shop={this.props.shop}
                        />
                    )}
                </Modal>
                <div
                    className="col-md-3 col-sm-6 f_p_item p-2"
                    onClick={() => this.openModal()}
                    style={{cursor: 'pointer'}}
                >
                    <h6 className="blue-color">
                        {this.props.shop.uiCommission}
                    </h6>
                    <div className="f_p_img d-flex">
                        <img
                            className="img-fluid img-min img align-self-center"
                            src={this.props.shop.logoPath}
                            alt=""
                        />
                    </div>
                    <h4>{this.props.shop.name}</h4>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        currentShop: state.shops.currentShopUniqueCode,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setCurrentShop: (uniqueCode: string) =>
            dispatch(setCurrentShop(uniqueCode)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ShopListElement));
