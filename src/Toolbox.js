
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faImage,
    faFont,
    faPencil,
    faFilter,
    faTrash,
    faDownload,
    faRectangleAd
} from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import { Circle, Image, IText, Rect } from 'fabric';
// import fabric from 'fabric';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../src/Toolbox.css'


library.add(faImage, faFont, faPencil, faFilter, faTrash, faDownload, faRectangleAd);

const Toolbox = ({ canvas, currentFilter, setCurrentFilter }) => {
    const styles = {
        width: "auto"
    }
    const [drawingMode, setDrawingMode] = useState(false);

    function fileHandler(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            const image = await Image.fromURL(e.target.result);
            image.scaleToWidth(400);
            image.set({
                selectable: true, // Allow selection
                hasControls: true, // Show resize and rotate controls
                left: 50,
                top: 50
            });
            canvas.renderAll();
            canvas.add(image);
            canvas.centerObject(image);
            canvas.setActiveObject(image);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    function addText() {
        const text = new IText('Edit this text');
        canvas.add(text);
        canvas.centerObject(text);
        canvas.setActiveObject(text);
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'photo_editor_image.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    function addRectangle() {
        const rect = new Rect({
            left: 300,
            top: 200,
            width: 100,
            height: 50,
            fill: 'rgba(255, 0, 0, 0.3)', // Transparent red
            stroke: 'red',
            strokeWidth: 2
        });
        canvas.add(rect);
    }

    function addCircle() {
        const rect = new Circle({
            left: 200,
            top: 200,
            radius: 50,
            fill: "rgba(0, 0, 255, 0.3)",
            stroke: "blue",
            strokeWidth: 2,
        });
        canvas.add(rect);
    }

    function toggleDrawingMode() {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        setDrawingMode(canvas.isDrawingMode);
    }
    // function enableDrawing() {
    //     canvas.isDrawingMode = !canvas.isDrawingMode; // Toggle drawing mode

    //     if (canvas.isDrawingMode) {
    //         if (!canvas.freeDrawingBrush) {
    //             canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    //         }
    //         canvas.freeDrawingBrush.color = "blue";
    //         canvas.freeDrawingBrush.width = 3;
    //     }
    // }

    function clearCanvasObjects() {
        canvas.getObjects().forEach(obj => canvas.remove(obj));
        canvas.renderAll();
    }

    return (
        <div className="toolbox">
            <button title="Add image">
                <FontAwesomeIcon icon="image" />
                <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={fileHandler} />
            </button>
            <button title="Add text" onClick={addText}>
                <FontAwesomeIcon icon="font" />
            </button>

            <button title="Filters"
                onClick={() => setCurrentFilter(currentFilter ? null : 'sepia')}
                className={currentFilter ? 'active' : ''}>
                <FontAwesomeIcon icon="filter" />
            </button>
            {currentFilter &&
                <select onChange={(e) => setCurrentFilter(e.target.value)} value={currentFilter}>
                    <option value="sepia">Sepia</option>
                    <option value="vintage">Vintage</option>
                    <option value="invert">Invert</option>
                    <option value="polaroid">Polaroid</option>
                    <option value="grayscale">Grayscale</option>
                </select>
            }

            <button title="Download as image" onClick={downloadImage}>
                <FontAwesomeIcon icon="download" />
            </button>

            {/* <button onClick={enableDrawing}>Enable Drawing</button> */}
            <button title="Drawing mode" onClick={toggleDrawingMode} className={drawingMode ? 'active' : ''}>
                <FontAwesomeIcon icon="pencil" />
            </button>
            <button style={styles} title="Rectangle" onClick={addRectangle}>
                Add Rectangle Shape
            </button>
            <button style={styles} title="Add Circle" onClick={addCircle}>Add Circle</button>
            <button style={styles} title="Clear Canvas" onClick={clearCanvasObjects}>Clear Canvas</button>

        </div>
    );
};

export default Toolbox;