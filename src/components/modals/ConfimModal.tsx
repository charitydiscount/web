import React from 'react';
import Modal from 'react-awesome-modal';
import { emptyHrefLink, logoPath } from "../../helper/Constants";

export interface ModalProps {
    visible: boolean;
    message: string;
    onClose: () => void;
    onSave: () => void;
}

export const ConfirmModal: React.FunctionComponent<ModalProps> = props => {
    return (
        <Modal
            visible={props.visible}
            effect="fadeInUp"
            onClickAway={() => props.onClose}
        >
            <div style={{padding: 15, maxWidth: 350}}>
                <div style={{textAlign: "center"}}>
                    <img src={logoPath} alt=""/>
                </div>
                <div style={{textAlign: "center", marginTop: 10}}>
                    <h4 style={{
                        overflowWrap: "break-word"
                    }}>
                        {props.message}
                    </h4>
                </div>
                <div style={{textAlign: 'center', marginTop: 15}}>
                    <a
                        style={{marginRight: 5}}
                        href={emptyHrefLink}
                        onClick={props.onSave}
                        className="genric-btn info-border circle"
                    >
                        <i className="fa fa-check" style={{fontSize: 18}}/>
                    </a>
                    <a
                        href={emptyHrefLink}
                        onClick={props.onClose}
                        className="genric-btn info-border circle"
                    >
                        <i className="fa fa-times" style={{fontSize: 18}}/>
                    </a>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
