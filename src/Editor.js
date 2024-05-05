import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect, useRef } from 'react';
import FloorPlanCanvas from './FloorPlanCanvas'
import './Editor.css';

function Editor(props) {
    const [formData, setFormData] = useState(props.floorPlanData);
    const [image, setImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleImageGet = (images) => {
        //console.log(images);
        setIsSaving(false);
        setImage({ full: images.full, cropped: images.cropped });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSaving(true);
        const form = event.currentTarget;
        setFormData({
            id: props.floorPlanData.id,
            croppedImage: null,
            fullImage: null,
            floorName: form[0].value,
            interiorSize: form[1].value,
            exteriorSize: form[2].value,
            exteriorType: form[3].value,
            facingDirection: form[4].value,
            floorType: form[5].value
        })
    };

    useEffect(() => {
        //console.log(image);
        if (null != formData && null != image) {
            const data = {
                id: props.floorPlanData.id,
                croppedImage: image.cropped,
                fullImage: image.full,
                floorName: formData.floorName,
                interiorSize: formData.interiorSize,
                exteriorSize: formData.exteriorSize,
                exteriorType: formData.exteriorType,
                facingDirection: formData.facingDirection,
                floorType: formData.floorType
            };
            props.onDataGet(data);
            setFormData(data);
        }
    }, [image]);

    useEffect(() => {
        //console.log(props.floorPlanData);
        setImage({ full: props.floorPlanData.fullImage, cropped: props.floorPlanData.croppedImage });
        setFormData(props.floorPlanData);
    }, [props.floorPlanData]);

    return (
        <Container fluid className='m-0 editor'>
            <Row>
                <Col>
                    <FloorPlanCanvas onImageGet={handleImageGet} needSaving={isSaving} image={formData.fullImage} />
                </Col>
                <Col md='auto'>
                    <Form onSubmit={handleSubmit} className='mx-5'>
                        <Form.Group className="mb-3" controlId='formFloorName'>
                            <Form.Label>Floor Name</Form.Label>
                            <Form.Control></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='formInteriorSize'>
                            <Form.Label>Interior Size</Form.Label>
                            <Form.Control></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='formExteriorSize'>
                            <Form.Label>Exterior Size</Form.Label>
                            <Form.Control></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='formExteriorType'>
                            <Form.Label>Exterior Type</Form.Label>
                            <Form.Select></Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='formFacingDirection'>
                            <Form.Label>Facing Direction</Form.Label>
                            <Form.Select>
                                <option value="North">North</option>
                                <option value="South">South</option>
                                <option value="East">East</option>
                                <option value="West">West</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='formFloorType'>
                            <Form.Label>Floor Type</Form.Label>
                            <Form.Select>
                                <option value="Studio">Studio</option>
                                <option value="One Bed One Bath">One Bed One Bath</option>
                                <option value="Two Bed One Bath">Two Bed One Bath</option>
                                <option value="Three Bed 2 Bath">Three Bed 2 Bath</option>
                            </Form.Select>
                        </Form.Group>
                        <Button type="submit" onSubmit={handleSubmit}>Save</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
export default Editor;