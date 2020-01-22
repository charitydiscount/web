import * as React from "react";
import {FormattedMessage} from 'react-intl';

class FaqEN extends React.Component {

    render() {
        return (
            <React.Fragment>
                <p className="sample-text">
                    <ol>
                        <li className="p-2">
                            Cum funcționează
                        </li>
                        <ul>
                            <li>
                                Cauți magazinul sau produsul dorit
                            </li>
                            <li>
                                Dai click pe magazin și vei fi redirecționat spre site-ul partenerului ales.
                            </li>
                            <li>
                                Continui în mod obișnuit cumpărăturile finalizând comanda
                            </li>
                            <li>
                                Revi pe CharityDiscount pentru a verifica câți bani ai economisit (durează câteva
                                minute)
                            </li>
                        </ul>
                    </ol>
                </p>
            </React.Fragment>
        )
    }

}

export default FaqEN;