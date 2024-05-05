import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import VerticalNavBar from './VerticalNavBar';
import HorizontalNavBar from './HorizontalNavBar'
import Editor from './Editor';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';

function App() {
  const [formDatas, setFormDatas] = useState([]);
  const [activeFormData, setActiveFormData] = useState({
    id: 0,
    croppedImage: null,
    fullImage: null,
    floorName: "",
    interiorSize: "",
    exteriorSize: "",
    exteriorType: "",
    facingDirection: "",
    floorType: ""
  });

  const handleIncomingData = (formData) => {
    //console.log(formData);
    if (undefined == formDatas.find(data => data.id == formData.id)) {
      setFormDatas([...formDatas, formData]);
    } else {
      setFormDatas(formDatas.map(data => {
        if (data.id == formData.id) {
          return formData;
        } else {
          return data;
        }
      }));
    }
  };

  const handleNewClick = () => {
    //console.log(formDatas.length);
    const newFormData = {
      id: formDatas.length,
      croppedImage: null,
      fullImage: null,
      floorName: "",
      interiorSize: "",
      exteriorSize: "",
      exteriorType: "",
      facingDirection: "",
      floorType: ""
    }
    setFormDatas([...formDatas, newFormData]);
    setActiveFormData(newFormData);
  };

  const handleExistingClick = (event) => {
    //console.log(formDatas.find(data => data.id == parseInt(event.target.id)));
    setActiveFormData(formDatas.find(data => data.id == parseInt(event.target.id)));
  }

  return (
    <Container fluid className='g-0 m-0'>
      <Row>
        <Col md='auto'>
          <VerticalNavBar></VerticalNavBar>
        </Col>
        <Col>
          <Row>
            <HorizontalNavBar></HorizontalNavBar>
          </Row>
          <Row className='p-4'>
            <Col xs={2} md={2}>
              <Stack gap={2}>
                <Button className='m-2' onClick={handleNewClick}>+</Button>
                <Stack gap={2} className='floorPlanList'>
                  {formDatas.map((formData, index) => (
                    <Card className='m-2' onClick={handleExistingClick}>
                      <Card.Img src={null == formData.croppedImage ? "../public/logo512.png" : URL.createObjectURL(formData.croppedImage)} />
                      <Card.ImgOverlay id={index.toString()}>
                        <Card.Title>{formData.floorName}</Card.Title>
                      </Card.ImgOverlay>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Col>
            <Col>
              <Editor onDataGet={handleIncomingData} floorPlanData={activeFormData} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
