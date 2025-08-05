import {Routes, Route, Navigate} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar.tsx";
import BanknotesList from "./components/BanknotesList/BanknotesList.tsx";
import BanknotesDetail from "./components/BanknotesDetail/BanknotesDetails.tsx";
import {useState} from "react";
import BreadCrumbs, {IBreadCrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";


function App() {
    const BanknotesPage = {name: 'Купюры', to: 'banknotes'};
    const [searchValue, setSearchValue] = useState('')
    const [pages, setPage] = useState<IBreadCrumb[]>([BanknotesPage])
    const addPage = (newPage: IBreadCrumb[]) => {
        setPage(newPage);
    };
    const resetSearchValue = () => {
        setSearchValue('');
    };

    return (
        <>
            <NavigationBar/>
            <BreadCrumbs pages={pages}/>
            <>
                <Routes>
                    <Route path="/" element={<Navigate to="banknotes"/>}/>
                    <Route path="/banknotes"
                           element={
                               <BanknotesList
                                   setPage={() => addPage([BanknotesPage])}
                                   searchValue={searchValue}
                                   resetSearchValue={resetSearchValue}
                                   handleSearchValue={(value) => setSearchValue(value)}
                               />
                           }
                    />
                    <Route path="/banknotes/:id" element={
                        <BanknotesDetail
                            setPage={(name, id) => addPage([
                                BanknotesPage, {name: `${name}`, to: `banknotes/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    );
}


export default App
