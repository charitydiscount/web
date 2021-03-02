import * as React from 'react';

const FaqRO = () => {
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
                                Link-urile către magazinele partenere de pe
                                CharityDiscount sunt către platforme
                                intermediare.
                            </li>
                            <li>
                                Aceste platforme contorizează click-ul și
                                mai apoi te redirecționează către magazinul
                                dorit.
                            </li>
                            <li>
                                De asemenea, un (third-party) cookie este
                                setat pe site-ul magazinului astfel că
                                acesta este conștient că ai venit de pe
                                CharityDiscount.
                            </li>
                            <li>
                                Acest cookie este valid pentru un anumit
                                număr de zile (e.g. 30) astfel că poți
                                beneficia de cashback chiar dacă nu accesezi
                                de fiecare dată magazinul prin intermediul
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
                                prezentat la întrebarea anterioară.
                            </li>
                            <li>
                                Acest cookie este tot timpul valid doar
                                pentru ultima platformă de pe cashback prin
                                care ai accesat magazinul.
                            </li>
                            <li>
                                Exemplu: dacă deschizi site-ul unui
                                magazin prin CharityDiscount și mai apoi
                                deschizi același site de pe o altă platformă
                                de cashback, vei primi cashback-ul doar pe
                                acea platformă.
                            </li>
                        </ul>
                    </p>
                    <p className="p-2">
                        <h5>Pentru ce produse primesc cashback?</h5>
                        <ul>
                            <li>
                                Pentru început, cashback-ul oferit face
                                parte din politica fiecărui magazin. Astfel
                                că, fiecare magazin stabilește cashback-ul
                                acordat care poate varia de la produs la
                                produs sau de la categorie la categorie
                                (e.g. 3% pentru telefoane, 10% pentru
                                cărti).
                            </li>
                            <li>
                                Totuși, magazinele oferă cashback pentru
                                orice cumpărătură efectuată (orice produs,
                                fie că este la promoție sau nu) ca urmare a
                                accesări magazinului prin intermediul
                                CharityDiscount.
                            </li>
                            <li>
                                Acest proces se numește marketing afiliat.
                            </li>
                        </ul>
                    </p>
                    <p className="p-2">
                        <h5>Este CharityDiscount gratis?</h5>
                        <ul>
                            <li>Da, CharityDiscount este gratis.</li>
                            <li>
                                Venitul platformei se bazează în întregime
                                pe conceptul promovat în sine. Cu alte
                                cuvinte, comisionul oferit de magazinele
                                partenere este împărțit între tine și
                                CharityDiscount.
                            </li>
                        </ul>
                    </p>
                </ol>
            </div>
        </React.Fragment>
    );
}

export default FaqRO;
