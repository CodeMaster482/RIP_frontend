import BanknoteTableCell from './BanknoteTableCell.tsx';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {FC, useEffect} from "react";
import {fetchBanknotes} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponents.tsx";
import MyComponent from "../Popup/Popover.tsx";
import {Link} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import './BanknoteTable.css'

interface BanknoteTableProps {
    setPage: () => void
}

const BanknoteTable: FC<BanknoteTableProps> = ({setPage}) => {
    const dispatch = useAppDispatch()
    const {banknotes, isLoading, error, success} = useAppSelector(state => state.banknoteReducer)
    useEffect(() => {
        setPage()
        dispatch(fetchBanknotes())
    }, []);

    return (
        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <Nav className="ms-2">
                <Nav.Item>
                    <Link to="/add-banknote-2" className="btn btn-outline-danger mt-2"
                          style={{marginLeft: '80px', marginBottom: '30px'}}>
                        Добавить купюру
                    </Link>
                </Nav.Item>
            </Nav>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Номинал купюры</th>
                    <th>Статус</th>
                    <th>Описание</th>
                    <th>Изображение</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {banknotes.map(banknote => (
                    <BanknoteTableCell banknoteData={banknote}/>
                ))
                }
                </tbody>
            </table>
        </>
    );
};

export default BanknoteTable;
