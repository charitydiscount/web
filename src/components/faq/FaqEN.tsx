import * as React from 'react';

class FaqEN extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="sample-text">
                    <ol>
                        <p className="p-2">
                            <h5>Cum folosesc CharityDiscount?</h5>
                            <ul>
                                <li>Cauți magazinul sau produsul dorit</li>
                                <li>
                                    Dai click pe magazin și vei fi redirecționat
                                    spre site-ul partenerului ales.
                                </li>
                                <li>
                                    Continui în mod obișnuit cumpărăturile
                                    finalizând comanda
                                </li>
                                <li>
                                    Revi pe CharityDiscount pentru a verifica
                                    câți bani ai economisit (durează câteva
                                    minute)
                                </li>
                            </ul>
                        </p>
                        <p className="p-2">
                            <h5>
                                De unde stie magazinul ca am venit de pe
                                CharityDiscount?
                            </h5>
                            <ul>
                                <li>
                                    Link-urile catre magazinele partenere de pe
                                    CharityDiscount sunt catre platforme
                                    intermediare.
                                </li>
                                <li>
                                    Aceste platforme contorizeaza click-ul si
                                    mai apoi te redirectioneaza catre magazinul
                                    dorit.
                                </li>
                                <li>
                                    De asemenea, un (third-party) cookie este
                                    setat pe site-ul magazinului astfel ca
                                    acesta este constient ca ai venit de pe
                                    CharityDiscount.
                                </li>
                                <li>
                                    Acest cookie este valid pentru un anumit
                                    numar de zile (e.g. 30) astfel ca poti
                                    beneficia de cashback chiar daca nu accesezi
                                    de fiecare data magazinul prin intermediul
                                    CharityDiscount.
                                </li>
                            </ul>
                        </p>
                        <p className="p-2">
                            <h5>
                                Pot beneficia de cashback pe mai multe platforme
                                simultan?
                            </h5>
                            <ul>
                                <li>
                                    Cashback-ul este acordat pe baza cookie-ului
                                    prezentat la intrebarea anterioara.
                                </li>
                                <li>
                                    Acest cookie este tot timpul valid doar
                                    pentru ultima platforma de pe cashback prin
                                    care ai accesat magazinul.
                                </li>
                                <li>
                                    Exemplu: daca deschizi site-ului unui
                                    magazin prin CharityDiscount si mai apoi
                                    deschizi acelasi site de pe o alta platforma
                                    de cashback, vei primi cashback-ul doar pe
                                    acea platforma.
                                </li>
                            </ul>
                        </p>
                        <p className="p-2">
                            <h5>Pentru ce produse primesc cashback?</h5>
                            <ul>
                                <li>
                                    Pentru inceput, cashback-ul oferit face
                                    parte din politica fiecarui magazin. Astfel
                                    ca, fiecare magazin stabileste cashback-ul
                                    acordat care poate varia de la produs la
                                    produs sau de la categorie la categorie
                                    (e.g. 3% pentru telefoane, 10% pentru
                                    carti).
                                </li>
                                <li>
                                    Totusi, magazinele ofera cashback pentru
                                    orice cumparatura efectuata (orice produs,
                                    fie ca este la promotie sau nu) ca urmare a
                                    accesari magazinului prin intermediul
                                    CharityDiscount.
                                </li>
                                <li>
                                    Acest proces se numeste marketing afiliat.
                                </li>
                            </ul>
                        </p>
                        <p className="p-2">
                            <h5>Este CharityDiscount gratis?</h5>
                            <ul>
                                <li>Da, CharityDiscount este gratis.</li>
                                <li>
                                    Venitul platformei se bazeaza in intregime
                                    pe conceptul promovat in sine. Cu alte
                                    cuvinte, comisionul oferit de magazinele
                                    partenere este impartit intre tine si
                                    CharityDiscount.
                                </li>
                            </ul>
                        </p>
                    </ol>
                </div>
            </React.Fragment>
        );
    }
}

export default FaqEN;
