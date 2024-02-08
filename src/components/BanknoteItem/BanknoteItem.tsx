import {FC} from 'react';
import {IBanknote} from '../../models/models.ts';
import './CardItem.css'


interface BanknoteItemProps {
    banknote: IBanknote;
    onClick: (num: number) => void,
    isServer: boolean
    reloadPage: () => void
}

const BanknoteItem: FC<BanknoteItemProps> = ({banknote, onClick, isServer, reloadPage}) => {
    const deleteClickHandler = () => {
        DeleteData()
            .then(() => {
                console.log(`Banknote with ID ${banknote.banknote_id} successfully deleted.`);
            })
            .catch(error => {
                alert(`Failed to delete banknote with ID ${banknote.banknote_id}: ${error}`)
            });
    }

    const DeleteData = async () => {
        const response = await fetch('http://127.0.0.1:8080/api/banknotes/' + banknote.banknote_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',

            },
        });
        if (response.status === 200) {
            reloadPage()
            return
        }
        throw new Error(`status code = ${response.status}`);
    }

    return (
        <div className="card-banknote-item" data-banknote-id={banknote.banknote_id}>
            <div>
                <img
                    src={banknote?.image_url || '/default.png'}
                    alt="Image"
                    className="photo"
                    onClick={() => onClick(banknote.banknote_id)}
                    id={`photo-${banknote.banknote_id}`}
                />
                {isServer && (
                    <div className="circle" onClick={deleteClickHandler}>
                        <img
                            src="/RIP_Frontend/deleteTrash.png"
                            alt="Del"
                            className="deleted-trash"
                        />
                    </div>
                )}
            </div>
            <div className="container-card" onClick={() => onClick(banknote.banknote_id)}>
                <div className='nominal-text'>{banknote.nominal}</div> 
                <div className='currency-text'>{banknote.currency}</div>
            </div>
        </div>
    );
};
// {`${banknote.nominal} ${banknote.currency}`}
export default BanknoteItem;
