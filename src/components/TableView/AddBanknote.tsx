import {useState, ChangeEvent, FormEvent, FC, useEffect} from 'react';
import {Button, Form, Container, Row, Col} from 'react-bootstrap';
import {createBanknote} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import MyComponent from "../Popup/Popover.tsx";
import Cookies from "js-cookie";

interface BanknoteData {
    banknoteName: string;
    description: string;
    image: File | null;
    currency: string
}

interface AddBanknoteProps {
    setPage: () => void
}

const CreateBanknotePage: FC<AddBanknoteProps> = ({setPage}) => {
    const [banknoteData, setBanknoteData] = useState<BanknoteData>({
        banknoteName: '',
        description: '',
        image: null,
        currency: '',
    });
    const {error, success} = useAppSelector(state => state.banknoteReducer)
    const role = Cookies.get('role')
    const dispatch = useAppDispatch()
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setBanknoteData({...banknoteData, [name]: value});
    };

    useEffect(() => {
        setPage()
    }, []);

    const save = () => {
        dispatch(createBanknote(banknoteData.banknoteName, banknoteData.description, banknoteData.currency, banknoteData.image))
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            banknoteData.image = file
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Handle form submission logic, e.g., dispatching data to the server
        console.log('Banknote data submitted:', banknoteData);
    };

    if (role != '2') {
        return <h2>нет прав</h2>
    }
    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <Container>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <h2 style={{ color: 'black' }}>Добавление компании</h2>                        <Form
                        onSubmit={handleSubmit}>
                            <Form.Group controlId="formCompanyName">
                                <Form.Label style={{ color: 'black' }}>Название компании</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Название"
                                    name="companyName"
                                    value={banknoteData.banknoteName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formCompanyIIN">
                                <Form.Label style={{ color: 'black' }}>ИИН</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Название"
                                    name="iin"
                                    value={banknoteData.currency}
                                    onChange={handleInputChange}
                                    required

                                />
                            </Form.Group>
                            <Form.Group controlId="formCityDescription">
                                <Form.Label style={{ color: 'black' }}>Описание компании</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Описание"
                                    name="description"
                                    value={banknoteData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formCompanyImage">
                                <Form.Label style={{ color: 'black' }}>Логотип компании</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>

                            <Button variant="danger" type="submit" style={{marginTop: '30px'}} onClick={save}>
                                Создать
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default CreateBanknotePage;
