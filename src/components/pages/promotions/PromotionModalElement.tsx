import * as React from 'react';
import Modal from 'react-awesome-modal';
import { AppState } from "../../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import PromotionElement from "./PromotionElement";
import { PromotionDto } from "../../../rest/DealsService";
import { keyDownEscapeEvent } from "../../../helper/AppHelper";
import { useEffect } from "react";

interface PromotionModalProps {
    promotion: PromotionDto,
    modalVisible: boolean,
    onCloseModal: () => void;

    //global state
    adBlockActive?: boolean
}

const PromotionModal = (props: PromotionModalProps) => {

    useEffect(() => {
        keyDownEscapeEvent(() => {
            props.onCloseModal()
        })
    }, [props])

    return (
        <Modal
            visible={!props.adBlockActive && props.modalVisible}
            effect="fadeInUp"
            onClickAway={props.onCloseModal}
        >
            {props.modalVisible && (
                <PromotionElement
                    key={'shop' + props.promotion.name}
                    promotion={props.promotion}
                    onCloseModal={props.onCloseModal}/>
            )}
        </Modal>
    );
}

const mapStateToProps = (state: AppState) => {
    return {
        adBlockActive: state.adBlock.isActive,
    };
};

export default connect(mapStateToProps)(PromotionModal);


