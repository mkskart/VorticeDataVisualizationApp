import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';

/**
 * TreeView component.
 * Displays hierarchical data using a tree view.
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.data - Hierarchical data to be displayed in the tree.
 * @param {Array} props.selectedNode - Array of selected nodes.
 * @param {function} props.setSelectedNode - Function to set selected nodes.
 * @param {function} props.setSelectedLine - Function to set selected line index.
 * @returns {JSX.Element} The rendered TreeView.
 */
const TreeView = ({ data, selectedNode, setSelectedNode, setSelectedLine }) => {
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to hold the ECharts option
  const [option, setOption] = useState(null);
  // State to track whether the Ctrl key is pressed
  const [ctrlKey, setCtrlKey] = useState(false);

  useEffect(() => {
    if (data) {
      // Function to process nodes for styling and numbering
      const processNode = (node, index) => {
        node.number = index + 1;
        node.itemStyle = {
          color: selectedNode.includes(node.name) ? 'red' : 'lightblue',
        };

        if (node.children && node.children.length > 0) {
          node.children.forEach(processNode);
        }
      };

      // Process and style the nodes
      processNode(data, 0);

      // Create the ECharts option for the tree view
      const newOption = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: [data],
            top: '-1%',
            left: '10%',
            bottom: '1%',
            right: '10%',
            symbolSize: 5,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 10,
              formatter: (params) => {
                const { data } = params;
                if (data.name) {
                  const cutName = data.name.split('_')[0];
                  return cutName;
                }
                return '';
              }
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              },
            },
            emphasis: {
              focus: 'descendant'
            },
            expandAndCollapse: false,
            animationDuration: 0,
            animationDurationUpdate: 0
          },
        ],
      };

      setOption(newOption);
      setLoading(false);
    }
  }, [data, selectedNode]);

  // Click event handler for tree nodes
  const handleClick = (params, ctrlKey) => {
    const { data } = params;
    if (data.name) {
      const clickedNodeName = data.name;
      let updatedSelectedNode;

      if (ctrlKey) {
        updatedSelectedNode = selectedNode.includes(clickedNodeName)
          ? selectedNode.filter((name) => name !== clickedNodeName)
          : [...selectedNode, clickedNodeName];
      } else {
        updatedSelectedNode = [clickedNodeName];
      }

      setSelectedNode(updatedSelectedNode);

      const index = clickedNodeName.split('_')[1];
      setSelectedLine(index);
    }
  };

  // Keyboard event listeners to track Ctrl key state
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        setCtrlKey(true);
      }
    };

    const handleKeyUp = (event) => {
      if (!event.ctrlKey && !event.metaKey) {
        setCtrlKey(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Title */}
      <h2>Tree View</h2>
      {/* Render loading message or the ECharts tree */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ReactEcharts
          option={option || {}}
          opts={{ renderer: 'svg' }}
          style={{ width: '100%', height: '500px', margin: '0 auto' }}
          onEvents={{ 
            click: (params) => {
              handleClick(params, ctrlKey);
            } 
          }}
        />
      )}
    </div>
  );

};

export default TreeView;
