import * as React from 'react';
import Modal from 'react-awesome-modal';
import { emptyHrefLink } from '../../helper/Constants';
import {
  isInFavoriteShops,
  updateFavoriteShops,
} from '../../rest/ShopsService';
import { computeUrl } from '../../helper/AppHelper';

interface IProductInfoState {
  visible: boolean;
  fShopVisible: boolean;
  favShop: boolean;
}

interface IProductProps {
  logoSrc: string;
  name: string;
  id: number;
  category: string;
  mainUrl: string;
  uniqueCode: string;
}

class Shop extends React.Component<IProductProps, IProductInfoState> {
  constructor(props: IProductProps) {
    super(props);
    this.state = {
      visible: false,
      fShopVisible: false,
      favShop: false,
    };
    this.updateFavoriteShops = this.updateFavoriteShops.bind(this);
    isInFavoriteShops(this.props.id, this);
  }

  closeModal() {
    this.setState({
      visible: false,
    });
  }

  closeFShopModal() {
    this.setState({
      fShopVisible: false,
      favShop: true,
    });
  }

  openFShopModal() {
    this.setState({
      fShopVisible: true,
    });
  }

  openModal() {
    this.setState({
      visible: true,
    });
  }

  /**
   * Used to add favorite shops to DB
   */
  public updateFavoriteShops() {
    this.openFShopModal();
    updateFavoriteShops(this.props.name);
  }

  public render() {
    return (
      <React.Fragment>
        <Modal
          visible={this.state.fShopVisible}
          effect="fadeInUp"
          onClickAway={() => this.closeFShopModal()}
        >
          <h3 style={{ padding: 15 }}>
            Favorite shop: {this.props.name} added
          </h3>
        </Modal>
        <Modal
          visible={this.state.visible}
          effect="fadeInUp"
          onClickAway={() => this.closeModal()}
        >
          <div className="text-center p_20">
            <img src={this.props.logoSrc} alt="" />
            <div className="blog_details">
              <a href={emptyHrefLink}>
                <h2>{this.props.name}</h2>
              </a>
              <h3>{'Category: ' + this.props.category}</h3>
              <a
                href={computeUrl(this.props.uniqueCode, this.props.mainUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="white_bg_btn"
              >
                Access
              </a>
            </div>
          </div>
        </Modal>
        <div className="col-lg-3 col-md-3 col-sm-6">
          <div className="f_p_item">
            <div className="f_p_img">
              <a href={emptyHrefLink} onClick={() => this.openModal()}>
                <img
                  className="img-fluid img-min img"
                  src={this.props.logoSrc}
                  alt=""
                />
              </a>

              <div
                className={
                  this.state.favShop === true ? 'p_iconUpdate' : 'p_icon'
                }
              >
                <a
                  href={emptyHrefLink}
                  onClick={
                    this.state.favShop === true
                      ? undefined
                      : this.updateFavoriteShops
                  }
                >
                  <i className="lnr lnr-heart" />
                </a>
              </div>
            </div>
            <a href={emptyHrefLink} onClick={() => this.openModal()}>
              <h4>{this.props.name}</h4>
            </a>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Shop;
