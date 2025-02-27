import React from "react";
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Trash2,
  Search,
  Save,
  Upload,
  BarChart,
} from "lucide-react";
import { useSpreadsheetStore } from "../store/spreadsheetStore";

const Toolbar: React.FC = () => {
  const {
    activeCell,
    data,
    setCellStyle,
    addRow,
    addColumn,
    deleteRow,
    deleteColumn,
    selection,
  } = useSpreadsheetStore();

  const handleBoldClick = () => {
    if (activeCell) {
      const currentStyle = data[activeCell]?.style || {};
      setCellStyle(activeCell, { bold: !currentStyle.bold });
    }
  };

  const handleItalicClick = () => {
    if (activeCell) {
      const currentStyle = data[activeCell]?.style || {};
      setCellStyle(activeCell, { italic: !currentStyle.italic });
    }
  };

  const handleAlignClick = (align: "left" | "center" | "right") => {
    if (activeCell) {
      setCellStyle(activeCell, { textAlign: align });
    }
  };

  const handleAddRow = () => {
    if (selection) {
      addRow(selection.end.row);
    } else {
      addRow();
    }
  };

  const handleAddColumn = () => {
    if (selection) {
      addColumn(selection.end.col);
    } else {
      addColumn();
    }
  };

  const handleDeleteRow = () => {
    if (selection) {
      deleteRow(selection.start.row);
    }
  };

  const handleDeleteColumn = () => {
    if (selection) {
      deleteColumn(selection.start.col);
    }
  };

  const [showFindReplace, setShowFindReplace] = React.useState(false);
  const [findText, setFindText] = React.useState("");
  const [replaceText, setReplaceText] = React.useState("");
  const [selectionOnly, setSelectionOnly] = React.useState(false);

  const { findAndReplace } = useSpreadsheetStore();

  const handleFindReplace = () => {
    if (findText) {
      findAndReplace(findText, replaceText, selectionOnly);
      setShowFindReplace(false);
    }
  };

  // Handle save spreadsheet
  const handleSaveSpreadsheet = () => {
    const data = {
      cells: cells,
      rowCount: 100,
      columnCount: 26,
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.json';
    a.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#f1f3f4] border-b border-gray-300 p-1 flex items-center space-x-1">
      <div className="flex items-center space-x-1 border-r border-gray-300 pr-1">
        <button
          className={`p-1 rounded hover:bg-gray-200 ${
            activeCell && data[activeCell]?.style?.bold ? "bg-gray-200" : ""
          }`}
          onClick={handleBoldClick}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          className={`p-1 rounded hover:bg-gray-200 ${
            activeCell && data[activeCell]?.style?.italic ? "bg-gray-200" : ""
          }`}
          onClick={handleItalicClick}
          title="Italic"
        >
          <Italic size={16} />
        </button>
      </div>

      <div className="flex items-center space-x-1 border-r border-gray-300 pr-1">
        <button
          className={`p-1 rounded hover:bg-gray-200 ${
            activeCell && data[activeCell]?.style?.textAlign === "left"
              ? "bg-gray-200"
              : ""
          }`}
          onClick={() => handleAlignClick("left")}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          className={`p-1 rounded hover:bg-gray-200 ${
            activeCell && data[activeCell]?.style?.textAlign === "center"
              ? "bg-gray-200"
              : ""
          }`}
          onClick={() => handleAlignClick("center")}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          className={`p-1 rounded hover:bg-gray-200 ${
            activeCell && data[activeCell]?.style?.textAlign === "right"
              ? "bg-gray-200"
              : ""
          }`}
          onClick={() => handleAlignClick("right")}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
      </div>

      <div className="flex items-center space-x-1 border-r border-gray-300 pr-1">
        <button
          className="p-1 rounded hover:bg-gray-200"
          onClick={handleAddRow}
          title="Add Row"
        >
          <Plus size={16} />
          <span className="ml-1 text-xs">Row</span>
        </button>
        <button
          className="p-1 rounded hover:bg-gray-200"
          onClick={handleAddColumn}
          title="Add Column"
        >
          <Plus size={16} />
          <span className="ml-1 text-xs">Column</span>
        </button>
      </div>

      <div className="flex items-center space-x-1 border-r border-gray-300 pr-1">
        <button
          className="p-1 rounded hover:bg-gray-200"
          onClick={handleDeleteRow}
          title="Delete Row"
          disabled={!selection}
        >
          <Trash2 size={16} />
          <span className="ml-1 text-xs">Row</span>
        </button>
        <button
          className="p-1 rounded hover:bg-gray-200"
          onClick={handleDeleteColumn}
          title="Delete Column"
          disabled={!selection}
        >
          <Trash2 size={16} />
          <span className="ml-1 text-xs">Column</span>
        </button>
      </div>

      <div className="flex items-center space-x-1 border-r border-gray-300 pr-1">
        <button
          className="p-1 rounded hover:bg-gray-200"
          onClick={() => setShowFindReplace(!showFindReplace)}
          title="Find and Replace"
        >
          <Search size={16} />
          <span className="ml-1 text-xs">Find & Replace</span>
        </button>
      </div>

      <div className="flex items-center space-x-1">
        <button
          className="p-1 rounded hover:bg-gray-200"
          title="Save Spreadsheet"
        >
          <Save size={16} />
        </button>
        <button
          className="p-1 rounded hover:bg-gray-200"
          title="Load Spreadsheet"
        >
          <Upload size={16} />
        </button>
        <button className="p-1 rounded hover:bg-gray-200" title="Insert Chart">
          <BarChart size={16} />
        </button>
      </div>

      {showFindReplace && (
        <div className="absolute top-14 left-4 bg-white shadow-lg rounded-md p-4 z-10 border border-gray-300">
          <h3 className="font-bold mb-2">Find and Replace</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm">Find:</label>
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="border border-gray-300 rounded p-1 w-full"
              />
            </div>
            <div>
              <label className="block text-sm">Replace with:</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="border border-gray-300 rounded p-1 w-full"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="selectionOnly"
                checked={selectionOnly}
                onChange={(e) => setSelectionOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="selectionOnly" className="text-sm">
                Selection only
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-200 px-2 py-1 rounded text-sm"
                onClick={() => setShowFindReplace(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                onClick={handleFindReplace}
              >
                Replace
              </button>
              <div className="bg-[#f1f3f4] border-b border-gray-300 p-1 flex items-center space-x-1">
                {/* Other toolbar buttons remain unchanged */}
                <div className="flex items-center space-x-1">
                  <button
                    className="p-1 rounded hover:bg-gray-200"
                    onClick={handleSaveSpreadsheet}
                    title="Save Spreadsheet"
                  >
                    <Save size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
