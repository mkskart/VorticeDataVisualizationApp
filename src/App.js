import React, { useState } from 'react';
import TreeView from './components/TreeView';
import ParallelChart from './components/ParallelChart';
import ClusterScatterplot from './components/ClusterScatterplot';
import ThreeJS from './components/ThreeJS';
import './App.css';

/**
 * Main application component.
 * @component
 * @returns {JSX.Element} The rendered application.
 */
const App = () => {
  // State to hold the data for two different sets
  const [data1, setData1] = useState(null); // First set of data
  const [data2, setData2] = useState(null); // Second set of data

  // State to track selected nodes and lines
  const [selectedNode, setSelectedNode] = useState([]); // Selected nodes
  const [selectedLine, setSelectedLine] = useState(null); // Selected line index

  /**
   * Handles the file upload event.
   * Parses and updates the data states with the uploaded JSON data.
   * @param {Event} event - The file upload event.
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      const jsonData = JSON.parse(fileContent);
      setData1(jsonData); // Update the first data set
      setData2(jsonData); // Update the second data set
    };

    reader.readAsText(file);
  };

  return (
    <div className="app">
      {/* File upload input */}
      <input type="file" onChange={handleFileUpload} accept="application/json" />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, backgroundColor: 'white' }}>
          {/* ThreeJS visualization */}
          <center><ThreeJS width={1000} height={500} /></center>
          {/* ParallelChart visualization */}
          <ParallelChart
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            selectedLine={selectedLine}
            setSelectedLine={setSelectedLine}
            data={data2}
          />
        </div>
        <div style={{ flex: 1, backgroundColor: 'white' }}>
          {/* ClusterScatterplot visualization */}
          <ClusterScatterplot />
          {/* TreeView visualization */}
          <TreeView
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            setSelectedLine={setSelectedLine}
            data={data1}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
