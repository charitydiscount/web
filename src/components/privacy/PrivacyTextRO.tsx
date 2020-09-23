import * as React from "react";


class PrivacyTextRO extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="sample-text">
                    <p className="text-muted">
                        Politica de confidențialitate prezentata
                        mai jos intră în vigoare de la data de
                        11.11.2019.
                    </p>
                    <ol>
                        <li className="p-2">
                            Informațiile pe care le stocăm
                        </li>
                        <ul>
                            <li className="">
                                <b>Nume si prenume</b>
                            </li>
                            <li className="">
                                <b>Adresa de email</b>
                            </li>
                            <li className="">
                                <b>IBAN</b>
                            </li>
                        </ul>
                        <li className="p-2 pt-4">
                            Cum sunt obținute aceste informații
                        </li>
                        Informațiile sunt colectate
                        prin introducerea lor de către
                        utilizatorii noștri direct în platformă
                        și sunt esențiale pentru buna
                        funcționare a serviciului nostru.
                        <li className="p-2 pt-4">
                            Cum și pentru ce folosim
                            informațiile stocate
                        </li>
                        Folosim și procesăm informațiile
                        colectate pentru a putea asigura
                        funcționalitatea platformei noastre după
                        cum urmează:
                        <p>
                            <b>Nume și Prenume</b> – le procesăm
                            pentru efectuarea plăților prin
                            transfer bancar către utilizatorii
                            noștri. Acestea sunt afișate public
                            in cadrul unei recenzii lasate de
                            utilizator.
                        </p>
                        <p>
                            <b>Adresa de email</b> – o procesăm
                            pentru crearea conturilor, în
                            procesul de autentificare și pentru
                            a transmite notificări.
                        </p>
                        <p>
                            <b>IBAN</b> - îl stocam pentru a
                            facilitate retragerea cashback-ului
                            și pentru a păstra istoricul
                            tranzacțiilor efectuate.
                        </p>
                        <li className="pt-2">
                            Platforme si servicii terțe:
                        </li>
                        <p>
                            Platforma CharityDiscount folosește
                            următoarele servicii oferite de
                            Google prin intermediul platformei{' '}
                            <b>Firebase</b>:
                            <ul>
                                <li className="p-1">
                                    Firebase Hosting
                                </li>
                                <li className="p-1">
                                    Firebase Analytics
                                </li>
                                <li className="p-1">
                                    Firebase Authentication
                                </li>
                                <li className="p-1">
                                    Firebase Firestore
                                </li>
                                <li className="p-1">
                                    Firebase Cloud Messaging
                                </li>
                            </ul>
                            Acestea sunt folosite exclusiv
                            pentru a asigura funcționarea
                            platformei CharityDiscount. Vă rugam
                            sa consultați politica de
                            confidențialitate a serviciilor
                            oferite de Google accesând următorul{' '}
                            <a href="https://policies.google.com/technologies/partner-sites?hl=ro">
                                link
                            </a>
                            .
                        </p>
                        <p>
                            De asemenea, folosim platforma{' '}
                            <a href="https://2performant.com/">
                                2performant
                            </a>{' '}
                            pentru afilierea cu magazinele
                            prezentate. Prin intermediul
                            2performant, obținem informațiile
                            despre magazine, oferte, comisioane
                            si cumpărăturile efectuate.
                            2performant nu are access la nicio
                            informație personală a
                            utilizatorilor noștri, comisionul
                            fiind acordat pe baza unui
                            identificator unic generat de
                            CharityDiscount. În urma
                            cumpărăturilor efectuate de
                            utilizatori, 2performant ne pune la
                            dispoziție următoarele informații:
                            magazinul de la care utilizatorul a
                            cumpărat, descrierea furnizata de
                            magazin (uneori poate conține
                            informații despre produsele
                            cumpărate), adresa IP si tipul
                            dispozitivului (exemplu: mobil) de
                            pe care s-a efectuat achiziția.
                        </p>
                    </ol>
                </div>
            </React.Fragment>
        )
    }
}

export default PrivacyTextRO;