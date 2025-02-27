import React, { useState } from 'react';
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';
import Grid from './components/Grid';
import FunctionHelp from './components/FunctionHelp';
import DataOperations from './components/DataOperations';
import { HelpCircle, Database } from 'lucide-react';

function App() {
  const [showFunctionHelp, setShowFunctionHelp] = useState(false);
  const [showDataOperations, setShowDataOperations] = useState(false);
  
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 p-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-green-600 font-bold text-xl mr-2">
            Sheets Clone
          </div>
          <div className="text-sm text-gray-600">
            Untitled spreadsheet
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded hover:bg-gray-100 flex items-center text-sm"
            onClick={() => setShowFunctionHelp(true)}
          >
            <HelpCircle size={16} className="mr-1" />
            Function Help
          </button>
          
          <button 
            className="p-1 rounded hover:bg-gray-100 flex items-center text-sm"
            onClick={() => setShowDataOperations(true)}
          >
            <Database size={16} className="mr-1" />
            Data Operations
          </button>
        </div>
      </div>
      
      {/* Toolbar */}
      <Toolbar />
      
      {/* Formula Bar */}
      <FormulaBar />
      
      {/* Grid */}
      <Grid />
      
      {/* Function Help Modal */}
      <FunctionHelp 
        isOpen={showFunctionHelp} 
        onClose={() => setShowFunctionHelp(false)} 
      />
      
      {/* Data Operations Modal */}
      <DataOperations 
        isOpen={showDataOperations} 
        onClose={() => setShowDataOperations(false)} 
      />
    </div>
  );
}

export default App;