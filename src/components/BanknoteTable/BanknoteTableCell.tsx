import React, {FC, useState} from 'react';
import {Button, Form, Col} from 'react-bootstrap';
import {IBanknote} from "../../models/models.ts";
import {deleteBanknote, updateBanknoteImage, updateBanknoteInfo} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch} from "../../hooks/redux.ts";

interface BanknoteTableCellProps {
    banknoteData: IBanknote
}

const BanknoteTableCell: FC<BanknoteTableCellProps> = ({banknoteData}) => {
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false);
    const [nominal, setNominal] = useState(banknoteData.nominal.toString() ?? "");
    const [currency, setCurrency] = useState(banknoteData.currency ?? "");
    const [description, setDescription] = useState(banknoteData.description ?? "");
    const [status, setStatus] = useState(banknoteData.status);
    // const [statusId, setStatusId] = useState(`${banknoteData.status}`);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleDeleteClick = () => {
        dispatch(deleteBanknote(banknoteData.banknote_id))
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        dispatch(updateBanknoteInfo(banknoteData.banknote_id, nominal, description, status, currency))
        if (imageFile) {
            dispatch(updateBanknoteImage(banknoteData.banknote_id, imageFile))
        }
        setIsEditing(false);
    };

    const handleInputChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setDescription(value)
    }

    const handleInputChangeNominal = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setNominal(value)
    }

    const handleInputChangeCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setCurrency(value)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {value} = e.target;
        setStatus(value)
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };



    if (isEditing) {
        return <td colSpan={6}>
            <div>
                <Form className='mx-5'>
                    <Form.Group as={Col} controlId="formBanknoteName" className='mt-2'>
                        <Form.Label>Номинал купюры</Form.Label>
                        <Form.Control
                            type="intager"
                            placeholder="Введите название купюры"
                            name="name"
                            value={nominal}
                            onChange={handleInputChangeNominal}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formBanknoteCurrency" className='mt-2'>
                        <Form.Label>Валюта</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите валюту"
                            name="currency"
                            value={currency}
                            onChange={handleInputChangeCurrency}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formBanknoteStatus" className='mt-2'>
                        <Form.Label>Статус</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={status}
                            onChange={handleInputChange}
                        >
                            <option value="действует">Действует</option>
                            <option value="удален">Удален</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formBanknoteDescription" className='mt-2'>
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Введите описание купюры"
                            name="description"
                            value={description}
                            onChange={handleInputChangeDescription}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBanknoteImage" className='mt-2'>
                        <Form.Label>Картинка</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Form.Group>

                    <div style={{display: 'flex', justifyContent: 'space-between'}} className='my-3'>
                        <Button variant="btn btn-success" onClick={handleSaveClick}>
                            Сохранить изменения
                        </Button>

                        <Button variant='btn btn-light' style={{border: 'solid 1px #999999'}} onClick={() => {
                            setIsEditing(false)
                        }}>
                            Отменить редактирование
                        </Button>
                    </div>
                </Form>
            </div>
        </td>
    }

    return (
        <>
            <tr key={banknoteData.banknote_id}>
                <td>{banknoteData.banknote_id}</td>
                <td>{banknoteData.nominal}</td>
                <td>{banknoteData.status}</td>
                <td>{banknoteData.description}</td>
                <td>{banknoteData.image_url &&
                    <img src={banknoteData.image_url}
                         alt="City Image"
                         className="img-thumbnail"
                         style={{width: '200px'}}/>
                }</td>
                <div className='my-3' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Button variant="btn btn-success" onClick={handleEditClick} style={{width: '10em'}} className='mb-2'>
                        Редактировать
                    </Button>

                    <Button variant="outline-success" onClick={handleDeleteClick} style={{width: '10em'}}>
                        Удалить
                    </Button>
                </div>
            </tr>
        </>
    )
};

export default BanknoteTableCell;
