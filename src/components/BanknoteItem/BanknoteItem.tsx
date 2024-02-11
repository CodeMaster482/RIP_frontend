import {FC} from 'react';
import {IBanknote} from '../../models/models.ts';
import './CardItem.css'

import {addBanknoteIntoOperation, fetchBanknotes} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


interface BanknoteItemProps {
    banknote: IBanknote;
    onClick: (num: number) => void,
    isServer: boolean
    setDraftID: (draftID: number | null) => void,
}

const BanknoteItem: FC<BanknoteItemProps> = ({banknote, onClick, isServer, setDraftID}) => {
    const dispatch = useAppDispatch()
    //const {increase} = banknoteSlice.actions
    //const {cash} = useAppSelector(state => state.banknoteReducer)
    const {isAuth} = useAppSelector(state => state.userReducer)
    const fetchBanknotesAndSetDraft = async () => {
        const draftId = await dispatch(fetchBanknotes());
        setDraftID(draftId);
    };
    const plusClickHandler = async () => {
        //dispatch(increase())
       dispatch(addBanknoteIntoOperation(banknote.banknote_id, 0.0, banknote.nominal.toString() ?? "Без номинала"))
        await fetchBanknotesAndSetDraft();
    }

    return (
        <div className="banknote-city-item" data-banknote-id={banknote.banknote_id}>
            <img
                src={banknote.image_url}
                alt="Image"
                className="photo"
                onClick={() => onClick(banknote.banknote_id)}
                id={`photo-${banknote.banknote_id}`}
            />
            {isServer && isAuth && (
                <FontAwesomeIcon
                    className="circle"
                    icon={faPlus}
                    onClick={() => plusClickHandler()}
                    size="1x"
                />
            )}
            <div className="container-card" onClick={() => onClick(banknote.banknote_id)}>
                <div className='nominal-text'>{banknote.nominal}</div> 
                <div className='currency-text'>{banknote.currency}</div>
            </div>
        </div>
    );
};
// {`${banknote.nominal} ${banknote.currency}`}
export default BanknoteItem;
