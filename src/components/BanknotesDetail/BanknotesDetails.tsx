import {FC, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {IBanknote, mockBanknotes} from '../../models/models.ts';
import './BanknotesCard.css'

interface BanknoteDetailProps {
    setPage: (name: string, id: number) => void
}

const BanknotesDetail: FC<BanknoteDetailProps> = ({setPage}) => {
    const params = useParams();
    const [banknote, setBanknote] = useState<IBanknote | null>(null);
    const navigate = useNavigate();

    const BackHandler = () => {
        navigate('/banknotes');
    }

    useEffect(() => {
        fetchBanknote()
            .catch((err) => {
                console.error(err);
                const previewID = params.id !== undefined ? parseInt(params.id, 10) - 1 : 0;
                const mockBanknote = mockBanknotes[previewID]
                setPage(mockBanknote.nominal.toString() ?? "Без названия", mockBanknote.banknote_id)
                setBanknote(mockBanknote);
            });

    }, [params.id]);

    async function fetchBanknote() {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/banknotes/${params.id}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPage(data.banknote?.nominal ?? "Без названия", data.banknote.banknote_id)
            setBanknote(data.banknote);
        } catch (error) {
            console.error('Error fetching banknote data', error);
            throw error;
        }
    }


    if (!banknote) {
        return <div>Loading...</div>;
    }

    return (
        !banknote
            ? <div>Loading...</div>
            : <div className="company-card-body">
                <div className="card-container gray-text">
                    <img
                        className="round"
                        src={banknote?.image_url || '/RIP_Frontend/default.png'}
                        alt={banknote?.nominal.toString()}
                    />
                    <h3>{banknote?.nominal}</h3>
                    <h6>Валюта: {banknote?.currency}</h6>
                    <h6>Статус: {banknote?.status}</h6>
                    <p>{banknote?.description}</p>
                    <div className="buttons">
                        <button className="btn btn-success" onClick={BackHandler}>Назад</button>
                    </div>
                </div>
            </div>
    );
};

export default BanknotesDetail;
