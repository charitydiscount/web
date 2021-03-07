import { emptyHrefLink, StorageKey } from '../../../helper/Constants';
import * as React from 'react';
import { ShopDto } from '../../../rest/ShopsService';
import { FormattedMessage } from 'react-intl';
import { PromotionDto } from '../../../rest/DealsService';
import { AppState } from '../../../redux/reducer/RootReducer';
import { connect } from 'react-redux';
import { getLocalStorage } from '../../../helper/StorageHelper';
import { computeUrl } from '../../../helper/AppHelper';
import { clickSaveAndRedirect } from '../../../rest/ClickService';
import RedirectModal from '../shops/RedirectModal';
import { useState } from "react";

interface PromotionElementProps {
    promotion: PromotionDto;
    onCloseModal?: () => void;

    //global state
    shops: ShopDto[];
}

const PromotionElement = (props: PromotionElementProps) => {

    const [redirectModalVisible, setRedirectModalVisible] = useState<boolean>(false);

    let shop = props.shops.find(
        shop => shop.id === props.promotion.program.id
    ) as ShopDto;

    const cashbackUrl = computeUrl(
        props.promotion.affiliateUrl,
        shop.uniqueCode,
        props.promotion.landingPageLink
    );

    const redirectStorageKey = getLocalStorage(StorageKey.REDIRECT_MESSAGE);

    let accessButton;
    if (redirectStorageKey && redirectStorageKey === 'true') {
        accessButton = (
            <a
                href={emptyHrefLink}
                target="_blank"
                rel="noopener noreferrer"
                className="main_btn"
                onClick={(event) => {
                    clickSaveAndRedirect(
                        event,
                        props.promotion.program.id,
                        cashbackUrl
                    );
                }}
            >
                <FormattedMessage
                    id={'shop.access.button'}
                    defaultMessage="Access"
                />
            </a>
        );
    } else {
        accessButton = (
            <a
                href={emptyHrefLink}
                rel="noopener noreferrer"
                className="main_btn"
                onClick={() => {
                    setRedirectModalVisible(true)
                }}
            >
                <FormattedMessage
                    id={'shop.access.button'}
                    defaultMessage="Access"
                />
            </a>
        );
    }

    let promotionEnd = new Date(props.promotion.promotionEnd);
    let Difference_In_Days = Math.ceil(
        (promotionEnd.getTime() - Date.now()) / (1000 * 3600 * 24)
    );

    return (
        <React.Fragment>
            <RedirectModal
                visible={redirectModalVisible}
                programId={props.promotion.program.id.toString()}
                onCloseModal={() => {
                    setRedirectModalVisible(false)
                }}
                cashbackUrl={cashbackUrl}
            />
            <div className="text-center p-4">
                <div style={{textAlign: 'right'}}>
                    <i
                        onClick={props.onCloseModal}
                        className="fa fa-times"
                    />
                </div>

                <h4 className="cashback-text" style={{marginBottom: 15}}>
                    <FormattedMessage
                        id={'promotions.expires.in'}
                        defaultMessage="Expira in"
                    />
                    <span className="blue-color">{Difference_In_Days}</span>
                    <FormattedMessage
                        id={'promotions.expires.in.days'}
                        defaultMessage=" zile"
                    />
                    <br/>
                </h4>
                <img
                    src={props.promotion.campaignLogo}
                    alt=""
                    style={{
                        maxWidth: 200,
                        maxHeight: 200,
                    }}
                />
                <h4 style={{marginTop: 10}}>
                    {props.promotion.campaignName}
                </h4>
                <div className="blog_details">
                    <h4 style={{maxWidth: 300, maxHeight: 150}}>
                        {props.promotion.name}
                    </h4>
                    <h6
                        style={{
                            maxWidth: 300,
                            maxHeight: 250,
                            overflow: 'auto',
                        }}
                    >
                        {props.promotion.description}
                    </h6>
                    <div
                        className="s_product_text"
                        style={{marginTop: 20, marginBottom: 20}}
                    >
                        <div
                            className="card_area p_20"
                            style={{
                                marginLeft: 15,
                            }}
                        >
                            {accessButton}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state: AppState) => ({
    shops: state.shops.allShops
});

export default connect(mapStateToProps)(PromotionElement);
