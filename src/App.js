import Toolbox from './Toolbox';
import EditorCanvas from './EditorCanvas';
import { useRef, useEffect, useState } from 'react';
import { Canvas, filters, PencilBrush } from 'fabric';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(null);

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current, { backgroundColor: 'white' });
    canvas.setDimensions({ width: 1000, height: 500 });
    setCanvas(canvas);

    const brush = new PencilBrush(canvas);
    brush.color = 'black';
    brush.width = 5;
    canvas.freeDrawingBrush = brush;

    return () => canvas.dispose();

  }, [canvasRef, setCanvas]);

  useEffect(() => {
    if (!canvas ||
      !canvas.getActiveObject() ||
      !canvas.getActiveObject().isType('image')) return;

    function getSelectedFilter() {
      switch (currentFilter) {
        case 'sepia':
          return new filters.Sepia();
        case 'vintage':
          return new filters.Vintage();
        case 'invert':
          return new filters.Invert();
        case 'polaroid':
          return new filters.Polaroid();
        case 'grayscale':
          return new filters.Grayscale();
        default:
          return null;
      }
    }
    const filter = getSelectedFilter();
    const img = canvas.getActiveObject();

    img.filters = filter ? [filter] : [];
    img.applyFilters();
    canvas.renderAll();
  }, [currentFilter, canvas]);

  useEffect(() => {
    if (!canvas) return;

    function handleSelection(e) {
      const obj = e.selected?.length === 1 ? e.selected[0] : null;
      const filter = obj?.filters?.at(0);
      setCurrentFilter(filter ? filter.type.toLowerCase() : null);
    }

    canvas.on({
      'selection:created': handleSelection,
      'selection:updated': handleSelection,
      'selection:cleared': handleSelection
    });

    return () => {
      canvas.off({
        'selection:created': handleSelection,
        'selection:updated': handleSelection,
        'selection:cleared': handleSelection
      });
    }

  }, [canvas, setCurrentFilter]);

  return (
    <div className="editor">
      <Toolbox
        canvas={canvas}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />
      <EditorCanvas
        ref={canvasRef}
        canvas={canvas}
        setCurrentFilter={setCurrentFilter}
      />
    </div>
  );
}

export default App;