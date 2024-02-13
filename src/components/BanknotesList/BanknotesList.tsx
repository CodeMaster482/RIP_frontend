import {useNavigate} from 'react-router-dom';
import {FC, useEffect, useState} from 'react';
import {IBanknote, mockBanknotes} from "../../models/models.ts";
import List from "../List.tsx";
import BanknoteItem from "../BanknoteItem/BanknoteItem.tsx";
import './BanknotesList.css'
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface BanknoteListProps {
    setPage: () => void
    searchValue?: string
    handleSearchValue: (value: string) => void
    resetSearchValue: () => void;
}

const BanknotesList: FC<BanknoteListProps> = ({setPage, searchValue, resetSearchValue, handleSearchValue}) => {
    const [Banknotes, setBanknotes] = useState<IBanknote[]>([]);
    const [serverIsWork, setServerStatus] = useState<boolean>(false);
    const [reloadPage, setReloadPage] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputValue = (document.getElementById('search-text-field') as HTMLInputElement)?.value;        console.log(inputValue)
        handleSearchValue(inputValue);
    };

    useEffect(() => {
        setPage()
        if (!reloadPage) {
            fetchBanknotes().catch((err) => {
                console.log(err)
                filterMockData()
            });
        }
    }, [searchValue, reloadPage]);

    useEffect(() => {
        if (reloadPage) {
            setReloadPage(false);
        }
    }, [reloadPage]);

    const fetchBanknotes = async () => {
        const url = 'http://127.0.0.1:8080/api/banknotes' + `?banknote=${searchValue ?? ''}`;

        const response = await fetch(url, {
            method: "GET",
            signal: AbortSignal.timeout(1000)
        })

        if (!response.ok) {
            setServerStatus(false)
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        //console.log(data)
        setServerStatus(true)
        if (!data.banknotes.banknotes_list || data.banknotes.banknotes_list.length === 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.getElementById('search-text-field').value = ""
            alert("Данных нет")
            resetSearchValue()
        }
        setBanknotes(data.banknotes.banknotes_list ?? []);
    }

    const filterMockData = () => {
        if (searchValue) {
            const searchValueLowerCase = (searchValue ?? '').toLowerCase();
            const filteredBanknotes = mockBanknotes.filter(banknote =>
                // Convert nominal to string for case-insensitive comparison
                banknote.nominal?.toString().includes(searchValueLowerCase)
            );
            if (filteredBanknotes.length === 0) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                document.getElementById('search-text-field').value = ""
                alert("Данных нет")
                resetSearchValue()
            }
            setBanknotes(filteredBanknotes);
        } else {
            setBanknotes(mockBanknotes);
        }
    }

    return (

        <div className='mx-auto d-flex flex-column w-100'>
            {/* Поиск */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
                <Form onSubmit={handleSearch} className="d-flex">
                    <div className="d-flex align-items-center"> {/* Обертка для создания отступа слева */}
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="me-2"
                            style={{ fontSize: '1.5em', color: '#777777' }}
                        />
                        <FormControl
                            id={'search-text-field'}
                            type="text"
                            placeholder="Поиск купюр"
                            aria-label="Search"
                        />
                        <Button type="submit" className="ms-2 btn btn-success">
                            Поиск
                        </Button>
                    </div>
                </Form>
            </div>

            <List items={Banknotes} renderItem={(banknote: IBanknote) => (
                <BanknoteItem
                    key={banknote.banknote_id}
                    banknote={banknote}
                    isServer={serverIsWork}
                    onClick={(num) => navigate(`/banknotes/${num}`)}
                    reloadPage={() => {
                        setReloadPage(true)
                    }}
                />
                )}
            />
        </div>

    );
};

export default BanknotesList;
