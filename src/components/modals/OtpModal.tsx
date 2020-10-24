import React, { useState } from 'react';
import Modal from 'react-awesome-modal';
import { logoPath } from "../../helper/Constants";
import { TextField } from "@material-ui/core";
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import Button from '@material-ui/core/Button';

export interface ModalProps {
    visible: boolean,
    onValidate: (otpCode) => void,
    onClose: () => void,
    intl: IntlShape
}

export const OtpModal: React.FunctionComponent<ModalProps> = props => {

    const [otpCode, setOtpCode] = useState('');

    return (
        <Modal
            visible={props.visible}
            effect="fadeInUp"
            onClickAway={props.onClose}
        >
            <div style={{padding: 15, maxWidth: 350}}>
                <div style={{textAlign: "center"}}>
                    <img src={logoPath} alt="" height={68} width={80}/>
                </div>
                <div style={{textAlign: "center", marginTop: 10}}>
                    <h4 style={{overflowWrap: "break-word"}}>
                        <FormattedMessage
                            id="user.info.delete.otp.mail.mesasge"
                            defaultMessage="A fost trimis pe mail-ul tău codul de validare pentru ștergerea contului."
                        />
                    </h4>
                    <TextField id="otpCode" variant="filled" style={{width: '100%'}}
                               label={props.intl.formatMessage({id: 'wallet.block.otp.request.placeholder'})}
                               onChange={(event) => {setOtpCode(event.target.value)}}
                               value={otpCode}
                    />
                </div>
                <div style={{textAlign: 'center', marginTop: 15}}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {props.onValidate(otpCode)}}
                        startIcon={
                            <ThumbUpAltIcon/>
                        }
                    >
                        <FormattedMessage
                            id="wallet.block.otp.proceed"
                            defaultMessage="Validate"
                        />
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default (injectIntl(OtpModal));
