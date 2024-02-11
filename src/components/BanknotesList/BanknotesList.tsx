import {useNavigate} from 'react-router-dom';
import React, {FC, useEffect} from 'react';
import {IBanknote} from "../../models/models.ts";
import List from "../List.tsx";
import BanknoteItem from "../BanknoteItem/BanknoteItem.tsx";
import './BanknotesList.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchBanknotes} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponents.tsx";
import MyComponent from "../Popup/Popover.tsx";
import {Button, Form} from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";
// import {progressSlice} from "../../store/reducers/ProgressData.ts";
import {searchSlice} from "../../store/reducers/SearchSlice.ts";
import {RootState} from "../../store/store.ts";
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import Nav from "react-bootstrap/Nav";
//import {companySlice} from "../../store/reducers/CompanySlice.ts";
// import {useSelector} from "react-redux";
// import {RootState} from "../../store/store.ts";

// import Button from "react-bootstrap/Button";

interface BanknoteListProps {
    setPage: () => void
    draftID: number | null
    setDraftID: (draftID: number | null) => void;
}

const BanknotesList: FC<BanknoteListProps> = ({setPage, draftID, setDraftID}) => {
    const dispatch = useAppDispatch()
    const searchText = useSelector((state: RootState) => state.searchReducer.type);
    const {banknotes, isLoading, error, success /*,draftID*/} = useAppSelector(state => state.banknoteReducer)
    const navigate = useNavigate();
    //const {searchValue} = useAppSelector(state => state.progressReducer)
    //const [draftID, setDraft] = useState<number | null>(null)

    useEffect(() => {
        setPage();
        const fetchBanknotesAndSetDraft = async () => {
            const draftId = await dispatch(fetchBanknotes(searchText));
            setDraftID(draftId);
        };
        fetchBanknotesAndSetDraft();
    }, []);

    if (!banknotes) {
        return <h3>Данных нет</h3>
    }

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        dispatch(fetchBanknotes(searchText))
    }

    return (
    
        <>
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
                        value={searchText}
                        placeholder="Поиск купюр"
                        aria-label="Search"
                        onChange={(e) => dispatch(searchSlice.actions.setType(e.target.value))}
                    />
                    <Button type="submit" className="ms-2 btn btn-danger">
                        Поиск
                    </Button>
                </div>




                <Nav.Item className="mx-2">
                    <FontAwesomeIcon
                        icon={faShoppingCart}
                        className={`my-2 mr-2 ${draftID === 0 ? 'disabled' : ''}`}
                        onClick={() => draftID !== 0 && navigate(`/operations/${draftID}`)}
                        style={{
                            cursor: draftID === 0 ? 'not-allowed' : 'pointer',
                            fontSize: draftID === 0 ? '1.5em' : '2em',
                            color: draftID === 0 ? '#777777' : 'white',
                            transition: 'color 0.3s ease',
                        }}
                    />
                </Nav.Item>
            </Form>
            </div>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            <List items={banknotes ?? []} renderItem={(banknote: IBanknote) =>
                <BanknoteItem
                    key={banknote.banknote_id}
                    banknote={banknote}
                    isServer={true}
                    onClick={(num) => navigate(`/banknotes/${num}`)}
                    setDraftID={setDraftID}
                />
            }
            />
        </>
    );
};

export default BanknotesList;
