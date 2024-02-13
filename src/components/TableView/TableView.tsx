import {FC} from "react";
import './TableView.css'
import {IBanknoteOperations} from "../../models/models.ts";
import {useAppDispatch} from "../../hooks/redux.ts";
import {deleteOperationById, updateOperationBanknote} from "../../store/reducers/ActionCreator.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


interface TableViewProps {
    status: string
    banknoteOperation: IBanknoteOperations[]
    setPage: (name: string, id: number) => void
    operationID: string
}

const TableView: FC<TableViewProps> = ({banknoteOperation, status, setPage, operationID}) => {
    const dispatch = useAppDispatch()
    //const {minus} = companySlice.actions
    //const {increase} = companySlice.actions
    //const {reset} = companySlice.actions
   // const {cash} = useAppSelector(state => state.companyReducer)


    const handleDelete = (id: number) => {
        //dispatch(minus())
        dispatch(deleteOperationById(id, operationID, setPage))
    }

    const handleCashChangePlus = (id: number, quantity: number) => {
        quantity += 1
        //dispatch(increase())
        console.log("id", id, "quantity", quantity)
        dispatch(updateOperationBanknote(id, quantity, operationID, setPage))
    }

    const handleCashChangeMinus = (id: number, quantity: number) => {
        quantity = quantity == 0 ? 0 : quantity - 1
        //dispatch(minus())
        dispatch(updateOperationBanknote(id, quantity, operationID, setPage))
    }

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th className="number">Кол-во</th>
                    <th>Купюра</th>
                    <th>Номинал</th>
                    <th>Описание</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {banknoteOperation.map((item, index) => (
                    <tr key={index}>
                        <td className="text-center">
                            {status == "черновик" && (
                                <>
                                    <button className="btn btn-sm btn-danger"
                                            onClick={() => handleCashChangeMinus(item.id, item.quantity)}>
                                        -
                                    </button>
                                    <span className="mx-2">{item.quantity} кол-во</span>
                                    <button className="btn btn-sm btn-danger"
                                            onClick={() => handleCashChangePlus(item.id, item.quantity)}>
                                        +
                                    </button>
                                </>
                            )}
                            {status != "черновик" && <span>{item.quantity} кол-во.</span>}
                        </td>
                        <td className="image-td">
                            <img src={item.banknote.image_url} alt="photo" />
                        </td>
                        <td className="city-name-td">{`${item.banknote.nominal} ${item.banknote.currency}`}</td>
                        <td>{item.banknote.description}</td>
                        {status === "черновик" && (
                            <td className="delete-td">
                                <FontAwesomeIcon
                                    className="delete-button-td"
                                    icon={faTrash}
                                    onClick={() => handleDelete(item.id)}
                                    size="2x"
                                />
                            </td>

                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

// {item.banknote.nominal}

export default TableView;
