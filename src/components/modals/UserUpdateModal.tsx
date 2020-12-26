import React, { useState } from 'react';
import Modal from 'react-awesome-modal';
import { emptyHrefLink, logoPath } from "../../helper/Constants";
import { TextField } from "@material-ui/core";
import { injectIntl, IntlShape } from 'react-intl';

interface UserUpdateModalProps {
    visible: boolean,
    onValidate: (userName) => void,
    onClose: () => void,
    intl: IntlShape
}

const UserUpdateModal: React.FunctionComponent<UserUpdateModalProps> = props => {

    const [userName, setUserName] = useState('');

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
                    <TextField id="userName" variant="filled" style={{width: '100%'}}
                               label={props.intl.formatMessage({id: 'user.update.name.label'})}
                               onChange={(event) => {
                                   setUserName(event.target.value)
                               }}
                               value={userName}
                    />
                </div>
                <div style={{textAlign: 'center', marginTop: 15}}>
                    <div style={{textAlign: 'center', marginTop: 15}}>
                        <a
                            href={emptyHrefLink}
                            onClick={() => {
                                props.onValidate(userName)
                            }}
                            className="genric-btn info-border circle"
                        >
                            <i className="fa fa-check" style={{fontSize: 18}}/>
                        </a>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default (injectIntl(UserUpdateModal));
