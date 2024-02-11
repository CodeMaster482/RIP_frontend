import {FC, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchBanknote} from "../../store/reducers/ActionCreator.ts";
import './BanknoteCard.css'

// import {IBanknote, mockBanknotes} from '../../models/models.ts';

interface BanknoteDetailProps {
    setPage: (name: string, id: number) => void
}

const BanknoteDetail: FC<BanknoteDetailProps> = ({setPage}) => {
    const params = useParams();
    const dispatch = useAppDispatch()
    const {banknote, isLoading, error} = useAppSelector(state => state.banknoteReducer)
    const navigate = useNavigate();

    const BackHandler = () => {
        navigate('/banknotes');
    }

    useEffect(() => {
        dispatch(fetchBanknote(`${params.id}`, setPage))
    }, [params.id]);

    return (
        <>
            {isLoading && <h1> Загрузка данных .... </h1>}
            {error && <h1>Ошибка {error} </h1>}
            {<div className="banknote-card-body">
                <div className="card-container gray-text">
                    <img
                        className="round"
                        src={banknote?.image_url}
                        alt={banknote?.nominal.toString()}
                    />
                    <h3>{banknote?.nominal}</h3>
                    <h6>ИИН: {banknote?.currency}</h6>
                    <h6>Статус: {banknote?.status}</h6>
                    <p>{banknote?.description}</p>
                    {/*{role == '2' &&*/}
                    {/*<FontAwesomeIcon*/}
                    {/*    className="delete-button-td"*/}
                    {/*    icon={faTrash}*/}
                    {/*    onClick={handleDelete}*/}
                    {/*    size="1x"*/}
                    {/*/>*/}
                    {/*}*/}
                    <div className="buttons">
                        <button className="btn btn-danger" onClick={BackHandler}>Назад</button>
                        {/*<button className="primary ghost">Записаться</button>*/}
                    </div>
                </div>
            </div>}
        </>
    );
};

export default BanknoteDetail;
