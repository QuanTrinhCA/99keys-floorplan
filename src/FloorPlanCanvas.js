import "./FloorPlanCanvas.css";
import { useState, useEffect, useRef } from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function FloorPlanCanvas(props) {
    const [imageElement, setImageElement] = useState(null);
    const [fullImage, setFullImageBlob] = useState(null);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [prevMouseX, setPrevMouseX] = useState(0);
    const [prevMouseY, setPrevMouseY] = useState(0);
    const [imageX, setImageX] = useState(0);
    const [imageY, setImageY] = useState(0);
    const [imageScale, setImageScale] = useState(1);
    const [imageRotation, setImageRotation] = useState(0);

    const validImageTypes = ['image/jpeg', 'image/png'];

    const canvasRef = useRef();
    const guideCanvasRef = useRef();
    const zoomRangeRef = useRef();

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        //console.log(droppedFile.type);
        if (validImageTypes.includes(droppedFile.type)) {
            const floorPlanImage = new Image();
            floorPlanImage.src = URL.createObjectURL(droppedFile);
            setImageElement(floorPlanImage);
            setFullImageBlob(new Blob([droppedFile], { type: 'image/png' }));
        }
    };

    const drawGuide = (ctx) => {
        ctx.canvas.height = canvasRef.current.scrollHeight * 2;
        ctx.canvas.width = canvasRef.current.scrollWidth * 2;
        const safezone = { width: 1.2 * ctx.canvas.height, height: 0.9 * ctx.canvas.height };
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, 0, (ctx.canvas.width - safezone.width) / 2, ctx.canvas.height);
        ctx.fillRect(ctx.canvas.width - (ctx.canvas.width - safezone.width) / 2, 0, (ctx.canvas.width - safezone.width) / 2, ctx.canvas.height);
        ctx.fillRect((ctx.canvas.width - safezone.width) / 2, 0, safezone.width, (ctx.canvas.height - safezone.height) / 2);
        ctx.fillRect((ctx.canvas.width - safezone.width) / 2, (ctx.canvas.height - safezone.height) / 2 + safezone.height, safezone.width, (ctx.canvas.height - safezone.height) / 2);
    }

    const drawImage = (ctx, img, x, y, scale, rotation) => {
        ctx.canvas.height = canvasRef.current.scrollHeight * 2;
        ctx.canvas.width = canvasRef.current.scrollWidth * 2;
        ctx.setTransform(scale, 0, 0, scale, x + img.width / 2, y + img.height / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    const handleBlobedCroppedImage = (blob) => {
        if (null != blob) {
            props.onImageGet({ full: (null == fullImage ? blob : fullImage), cropped: blob });
        }
    }

    const sendBackCroppedImage = (mainCanvas) => {
        const mainCanvasContext = mainCanvas.getContext('2d');
        const safezone = { width: 1.2 * mainCanvasContext.canvas.height, height: 0.9 * mainCanvasContext.canvas.height };
        const tempCanvas = document.createElement('canvas');
        const tempCanvasContext = tempCanvas.getContext('2d');
        tempCanvasContext.canvas.width = 800;
        tempCanvasContext.canvas.height = 600;
        tempCanvasContext.drawImage(mainCanvas, (mainCanvasContext.canvas.width - safezone.width) / 2, (mainCanvasContext.canvas.height - safezone.height) / 2, safezone.width, safezone.height, 0, 0, 800, 600)
        tempCanvas.toBlob(handleBlobedCroppedImage, "image/png");
    }

    const panImage = (x, y) => {
        if (!isNaN(x)) {
            setImageX(imageX + x);
        }
        if (!isNaN(y)) {
            setImageY(imageY + y);
        }
    }

    const zoomImage = (modifier) => {
        const newImageScale = imageScale + modifier
        if (!isNaN(modifier) && 0.1 < newImageScale && 15.1 > newImageScale) {
            setImageScale(newImageScale);
        }
    }

    const rotateImage = (modifier) => {
        var rot = imageRotation + modifier;
        if (360 < rot) {
            rot -= 360;
        }
        if (-360 > rot) {
            rot += 360;
        }
        setImageRotation(rot);
    }

    const handleMouseUpOrLeave = (event) => {
        event.target.onmousemove = null;
    }

    const handleMouseDown = (event) => {
        event.preventDefault();
        event.target.onmousemove = handleMouseMove;
        setPrevMouseX(event.layerX);
        setPrevMouseY(event.layerY);
    }

    const handleMouseMove = (event) => {
        setMouseX(event.layerX);
        setMouseY(event.layerY);
    }

    const handleWheel = (event) => {
        if (0 > event.deltaY) {
            zoomImage(0.1);
        } else if (0 < event.deltaY) {
            zoomImage(-0.1);
        }
    }

    const handleRotateLeftClicked = () => {
        rotateImage(-90);
    }

    const handleRotateRightClicked = () => {
        rotateImage(90);
    }

    const handleZoomIncreaseCllicked = () => {
        zoomImage(0.1);
    }

    const handleZoomDecreaseCllicked = () => {
        zoomImage(-0.1);
    }

    const handleZoomRangeChanged = (event) => {
        setImageScale(parseFloat(event.target.value));
    }

    useEffect(() => {
        if (null != imageElement) {
            setImageX(0);
            setImageY(0);
            setImageScale(1);
            setImageRotation(0);
            drawGuide(guideCanvasRef.current.getContext('2d'));
            imageElement.onload = () => {
                drawImage(canvasRef.current.getContext('2d'), imageElement, 0, 0, 1, 0);
                drawGuide(guideCanvasRef.current.getContext('2d'));
            };
        }
    }, [imageElement]);

    useEffect(() => {
        if (null != imageElement) {
            zoomRangeRef.current.onChange = null;
            zoomRangeRef.current.value = imageScale;
            zoomRangeRef.current.onChange = handleZoomRangeChanged;
            drawImage(canvasRef.current.getContext('2d'), imageElement, imageX, imageY, imageScale, imageRotation);
        }
    }, [imageX, imageY, imageScale, imageRotation]);

    useEffect(() => {
        panImage(mouseX - prevMouseX, mouseY - prevMouseY);
        setPrevMouseX(mouseX);
        setPrevMouseY(mouseY);
    }, [mouseX, mouseY]);

    useEffect(() => {
        if (props.needSaving) {
            sendBackCroppedImage(canvasRef.current);
        }
    }, [props.needSaving]);

    useEffect(() => {
        //console.log(props.image);
        var ctx = guideCanvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (null == props.image) {
            setImageElement(null);
            setFullImageBlob(null);
        } else {
            const floorPlanImage = new Image();
            floorPlanImage.src = URL.createObjectURL(props.image);
            setImageElement(floorPlanImage);
            setFullImageBlob(props.image);
        }
    }, [props.image]);

    return (
        <Stack>
            <div className="CanvasWraper">
                <canvas
                    ref={canvasRef}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleDrop}
                    className="border border-5">
                </canvas>
                <canvas
                    ref={guideCanvasRef}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleDrop}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                    onWheel={handleWheel}>
                </canvas>
            </div>
            <Container fluid className="ControlWraper m-0 p-2">
                <Row>
                    <Col className="d-flex justify-content-end" xs={8}>
                        <Stack className="ZoomControl" direction="horizontal" gap={2}>
                            <Button onClick={handleZoomDecreaseCllicked}>-</Button>
                            <Form.Range ref={zoomRangeRef} defaultValue={1} max={15} min={0.5} step={0.5} onChange={handleZoomRangeChanged} />
                            <Button onClick={handleZoomIncreaseCllicked}>+</Button>
                        </Stack>
                    </Col>
                    <Col>
                        <InputGroup className="d-flex justify-content-end">
                            <Button onClick={handleRotateLeftClicked}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2l17.6-17.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0z" /></svg>
                            </Button>
                            <Button onClick={handleRotateRightClicked}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32h128c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2l-17.6-17.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0z" /></svg>
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        </Stack>
    );
}
export default FloorPlanCanvas;