import React, { useState } from "react";
import { PromotionDto } from "../../../rest/DealsService";
import PromotionModalElement from "./PromotionModalElement";

const PromotionList = (props: { promotion: PromotionDto }) => {

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <React.Fragment>
            <PromotionModalElement
                promotion={props.promotion}
                modalVisible={modalVisible}
                onCloseModal={() => {
                    setModalVisible(false)
                }}
            />
            <div
                className="col-md-4 shop-container"
                onClick={() => {
                    setModalVisible(true)
                }}
                style={{cursor: 'pointer'}}
            >
                <div className="f_p_item shop">
                    <div className="shop-image-container">
                        <div
                            className="shop-image"
                            style={{
                                maxWidth: 200,
                                maxHeight: 200,
                                backgroundImage:
                                    'url(' + props.promotion.campaignLogo + ')',
                            }}
                        />
                    </div>
                    <div style={{
                        padding: 5,
                        overflow: 'auto'
                    }} className="shop-description-container">
                        <h6 className="comission">
                            {props.promotion.name}
                        </h6>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default PromotionList;