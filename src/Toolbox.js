
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
import { Circle, Image, IText, Rect, Text } from 'fabric';
// import fabric from 'fabric';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../src/Toolbox.css'


library.add(faImage, faFont, faPencil, faFilter, faTrash, faDownload, faRectangleAd);

const Toolbox = ({ canvas, currentFilter, setCurrentFilter }) => {
    const styles = {
        width: "auto"
    }

    const styleInput = {
        opacity: 0,
        position: "absolute",
        inset: 0,
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

    function clearCanvasObjects() {
        canvas.getObjects().forEach(obj => canvas.remove(obj));
        canvas.renderAll();
    }

    const addFireIcon = () => {
        //const canvas = canvasRef.current.fabric;

        const fireIcon = new Text("🧯", {
            left: 100,
            top: 100,
            fontSize: 50,
            selectable: true,
        });

        canvas.add(fireIcon);
    };

    function saveCanvasState() {
        const json = JSON.stringify(canvas.toJSON()); // Convert canvas to JSON string
        localStorage.setItem("canvasState", json); // Save JSON in LocalStorage
        alert("Canvas state saved!");
    }

    // function loadCanvasState(imageUrl) {
    //     const savedJson = localStorage.getItem("canvasState");

    //     if (savedJson) {
    //         Image.fromURL(imageUrl, function (img) {
    //             img.set({
    //                 left: 0,
    //                 top: 0,
    //                 selectable: false, // Prevent selecting the image
    //                 evented: false, // Prevent dragging the image
    //             });

    //             // Set the image as background
    //             canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

    //             // Load saved annotations AFTER the image is set
    //             canvas.loadFromJSON(savedJson, function () {
    //                 canvas.renderAll();
    //                 alert("Canvas loaded! You can edit the annotations now.");
    //             });
    //         });
    //     } else {
    //         alert("No saved canvas state found in LocalStorage.");
    //     }
    // }
    function loadCanvasState(imageUrl) {
        const savedJson = localStorage.getItem("canvasState");

        if (savedJson) {
            Image.fromURL(imageUrl, function (img) {
                img.set({
                    left: 0,
                    top: 0,
                    selectable: false, // Prevent selecting the image
                    evented: false, // Prevent dragging the image
                });

                // Set the image as background
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                // Load saved annotations AFTER the image is set
                canvas.loadFromJSON(savedJson, function () {
                    canvas.renderAll();
                    alert("Canvas loaded! You can edit the annotations now.");
                });
            });
        } else {
            alert("No saved canvas state found in LocalStorage.");
        }
    }

    function updateCanvasState() {
        const json = JSON.stringify(canvas.toJSON());
        localStorage.setItem("canvasState", json);
        alert("Canvas updated and saved!");
    }



    return (
        <div className="toolbox">
            <button title="Add image">
                <FontAwesomeIcon icon="image" />
                <input
                    style={styleInput}
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
            <button style={styles} onClick={addFireIcon}>
                Add fire extinguisher
            </button>
            <button style={styles} title="Rectangle" onClick={addRectangle}>
                Add Rectangle Shape
            </button>
            <button style={styles} title="Add Circle" onClick={addCircle}>Add Circle</button>
            <button style={styles} title="Clear Canvas" onClick={clearCanvasObjects}>Clear Canvas</button>
            <button style={styles} title="Save Canvas" onClick={saveCanvasState}>Save Annotations</button>
            <button style={styles} title="Load Canvas">Load Canvas
                <FontAwesomeIcon icon="image" />
                <input
                    style={styleInput}
                    type="file"
                    id="imageInput"
                    accept=".png, .jpg, .jpeg"
                    onChange={loadCanvasState} />

            </button>
            <button style={styles} title="Update Canvas" onClick={updateCanvasState}>Update Canvas</button>
        </div>
    );
};

export default Toolbox;