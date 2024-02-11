import {Routes, Route} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";
import BanknotesList from "./components/BanknotesList/BanknotesList.tsx";
import BanknoteDetail from "./components/BanknotesDetail/BanknoteDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {Breadcrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";
import RequestView from "./components/RequestView/RequestView.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.tsx";
import BanknoteTable from "./components/BanknoteTable/BanknoteTable.tsx";
import CreateBanknotePage from "./components/TableView/AddBanknote.tsx";
import OperationCard from "./components/RequestView/OperationCard.tsx";
// import Menu from "./components/Menu/Menu.tsx";

function App() {
    const homePage: Breadcrumb = {name: 'Главная', to: 'banknotes'};
    const addBanknotePage: Breadcrumb = {name: 'Созадние купюры', to: 'add-banknote'};
    const banknotesTablePage: Breadcrumb = {name: 'Таблица купюр', to: 'banknotes/admin'};
    const banknotesPage: Breadcrumb = {name: 'Купюры', to: 'banknotes'};
    const requestPage: Breadcrumb = {name: 'Заявки', to: 'request'};
    const [pages, setPage] = useState<Breadcrumb[]>([banknotesPage])
    const [draftID, setDraftID] = useState<number | null>(0);

    const addPage = (newPage: Breadcrumb[]) => {
        setPage(newPage);
    };

    return (
        <>
            <NavigationBar/>
            <BreadCrumbs paths={pages}/>
            <>
                <Routes>
                    <Route path="/" element={
                        <BanknotesList
                            setPage={() => addPage([homePage])}
                            draftID={draftID}
                            setDraftID={setDraftID}
                        />
                    }/>
                    
                    <Route path="/banknotes" element={
                        <BanknotesList
                            setPage={() => addPage([homePage])}
                            draftID={draftID}
                            setDraftID={setDraftID}
                        />
                    }/>

                    <Route path="/banknotes" element={
                        <BanknotesList
                            setPage={() => addPage([homePage, banknotesPage])}
                            draftID={draftID}
                            setDraftID={setDraftID}
                        />
                    }
                    />

                    <Route path="/request" element={
                        <RequestView
                            setPage={() => addPage([homePage, requestPage])}
                        />
                    }
                    />

                    <Route path="/add-banknote" element={
                        <CreateBanknotePage
                            setPage={() => addPage([homePage, addBanknotePage])}
                        />}
                    />

                    <Route path="/add-banknote-2" element={
                        <CreateBanknotePage
                            setPage={() => addPage([homePage, banknotesTablePage, addBanknotePage])}
                        />}
                    />

                    <Route path="/login" element={<LoginPage/>}/>

                    <Route path="/banknotes/admin" element={
                        <BanknoteTable
                            setPage={() => addPage([homePage, banknotesTablePage])}
                        />}
                    />

                    <Route path="/register" element={<RegisterPage/>}/>

                    <Route path="/operations/:operation_id" element={
                        <OperationCard setPage={
                            (id) => addPage([
                                homePage,
                                requestPage,
                                {name: `Операция`, to: `operation/${id}`}
                            ])
                        }/>
                    }/>

                    <Route path="/banknotes/:id" element={
                        <BanknoteDetail
                            setPage={(name, id) => addPage([
                                homePage,
                                banknotesPage,
                                {name: `${name}`, to: `banknotes/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App
