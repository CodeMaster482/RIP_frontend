import {FC, useEffect, useState} from 'react';
import {
    // convertServerDateToInputFormat,
    DateFormat,
    deleteOperation,
    emptyString, fetchOperationById,
    makeOperation,
    // moderatorUpdateStatus,
    updateOperation
} from '../../store/reducers/ActionCreator.ts';
import TableView from '../TableView/TableView.tsx';
import {IOpearation} from '../../models/models.ts';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {useNavigate, useParams} from "react-router-dom";
import MyComponent from "../Popup/Popover.tsx";

interface OperationCardProps {
    setPage: (name: string, id: number) => void
}


const OperationCard: FC<OperationCardProps> = ({setPage}) => {
    const {operation_id} = useParams();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const {singleOperation, success, error} = useAppSelector(state => state.operationReducer)
    const [operationName, setOperationName] = useState('$');
    // const role = Cookies.get('role')

    useEffect(() => {
        if (operation_id) {
            dispatch(fetchOperationById(operation_id, setPage))
        }
    }, []);

    const handleDeleteOperation = (id: number) => {
        dispatch(deleteOperation(id))
        navigate(-1);
    }

    const handleMakeRequest = (id: number) => {
        dispatch(makeOperation(id))
        navigate("/request");
    }

    const handleSave = (id: number, operation: IOpearation) => {
        dispatch(
            updateOperation(
                id,
                operationName == '$' ? operation.operation_name : operationName,
            )
        )
    }

    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <div className='mx-5 mb-5'>
                {
                    singleOperation && <>
                        {/* ======================= ШАПКА =============================== */}

                        <div className="card">
                            <h3>Статус: {singleOperation.status}</h3>
                            <div className="info">
                                <div className="author-info">
                                        <h4>Имя: {emptyString(singleOperation.user_name, "Имя не задано")}</h4>
                                        <h4>Логин: {emptyString(singleOperation.user_login, 'Логин на задан')}</h4>
                                </div>

                            </div>
                            <div className="detail-info">
                                {singleOperation.status !="черновик" && <label>Сформирована: {DateFormat(singleOperation.formation_at)}</label>}
                                <label htmlFor="operationNameInput" style={{ color: 'black' }}>
                                    <h4 style={{textAlign: 'left'}}>Название операции:</h4>
                                </label>
                                <input
                                    type="text"
                                    id="operationNameInput"
                                    className="form-control bg-white text-black"
                                    value={operationName === "$" ? singleOperation.operation_name : operationName}
                                    onChange={(e) => setOperationName(e.target.value)}
                                    style={{ marginBottom: '20px' }}
                                    disabled={singleOperation.status !== 'черновик'}
                                />

                            </div>
                            <div style={{textAlign: 'right'}}>
                                {singleOperation.status == 'черновик' && <button
                                    type="button"
                                    className="btn btn-outline-success"
                                    onClick={() => handleSave(singleOperation.id, singleOperation)}
                                    style={{width: '150px', marginTop: '15px'}}
                                >
                                    Сохранить
                                </button>}
                            </div>
                        </div>

                        {/* ======================= ТАБЛИЦА ============================= */}

                        <TableView
                            setPage={setPage}
                            operationID={operation_id ?? ''}
                            banknoteOperation={singleOperation.operation_banknote}
                            status={singleOperation.status}
                        />

                        {/* ======================= КНОПКИ ============================= */}

                        <div className='delete-make' style={{display: 'flex', gap: '10px'}}>
                            {singleOperation.status != 'удален' && singleOperation.status == 'черновик' && (
                                <div style={{flex: 1}}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-success"
                                        onClick={() => handleDeleteOperation(singleOperation.id)}
                                    >
                                        Очистить
                                    </button>
                                </div>
                            )}

                            {singleOperation.status == 'черновик' && (
                                <div style={{flex: 1}}>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => handleMakeRequest(singleOperation.id)}
                                    >
                                        Сформировать
                                    </button>
                                </div>
                            )}

                            {/*{singleOperation.status == 'сформирован' && role == '2' && (*/}
                            {/*    <>*/}
                            {/*        <div style={{flex: 1}}>*/}
                            {/*            <button*/}
                            {/*                type="button"*/}
                            {/*                className="btn btn-outline-danger"*/}
                            {/*                onClick={() => handleDiscard()}*/}
                            {/*            >*/}
                            {/*                Отказать*/}
                            {/*            </button>*/}
                            {/*        </div>*/}

                            {/*        <div style={{flex: 1}}>*/}
                            {/*            <button*/}
                            {/*                type="button"*/}
                            {/*                className="btn btn-outline-light"*/}
                            {/*                onClick={handlerApprove}*/}
                            {/*            >*/}
                            {/*                Завершить*/}
                            {/*            </button>*/}
                            {/*        </div>*/}
                            {/*    </>*/}
                            {/*)}*/}
                        </div>
                    </>
                }
            </div>
        </>
    );
};

export default OperationCard;
