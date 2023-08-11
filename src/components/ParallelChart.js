import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

/**
 * ParallelChart component.
 * Displays data using a parallel coordinate chart.
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.data - Data to be displayed on the chart.
 * @param {Array} props.selectedNode - Array of selected nodes.
 * @param {function} props.setSelectedNode - Function to set selected nodes.
 * @param {number} props.selectedLine - Index of the selected line.
 * @param {function} props.setSelectedLine - Function to set selected line index.
 * @returns {JSX.Element} The rendered ParallelChart.
 */
const ParallelChart = ({ data, selectedNode, setSelectedNode, selectedLine, setSelectedLine }) => {
  // Ref for the chart element
  const chartRef = useRef(null);
  // Array to store formatted data for the chart
  const formattedDataArray = [];

  /**
   * Determines styling for nodes based on selection.
   * @param {string} name - Node name.
   * @returns {Object} Styling properties for the node.
   */
  const getNodeStyling = (name) => {
    const selected = selectedNode.includes(name);
    return {
      color: selected ? "red" : "gray",
      opacity: selected ? 1 : 0.25,
      width: selected ? 2 : 0.5,
    };
  };

  useEffect(() => {
    // Function to recursively parse and format data nodes
    const parseNode = (node) => {
      const { name, children } = node;
      const dataArray = [];

      // Extract values from the node name using regex
      if (name) {
        const regex = /([^_]+)=([^_]+)/g;
        let match;

        while ((match = regex.exec(name)) !== null) {
          const value = match[2];
          dataArray.push(value);
        }
      }

      // Recursively process children
      if (children && children.length > 0) {
        children.forEach(parseNode);
      }

      // Split and format data for chart
      const splitArrays = [];
      const arrayLength = 19;
      let { color, opacity, width } = getNodeStyling(name);

      for (let i = 0; i < dataArray.length; i += arrayLength) {
        const seriesData = {
          value: dataArray.slice(i, i + arrayLength),
          lineStyle: {
            show: true,
            width,
            opacity,
            curveness: 0,
            type: "solid",
            color,
          },
        };
        splitArrays.push(seriesData);
      }

      formattedDataArray.push(...splitArrays);
    };

    // Parse and format data nodes
    if (data && data.children && data.children.length > 0) {
      data.children.forEach(parseNode);
    }

    // Initialize the chart
    const chart = echarts.init(chartRef.current);

    // Configure the chart option
    const option = {
      parallelAxis: [
        { dim: 0, name: "Isovalue" },
        { dim: 1, name: "Lambda2" },
        { dim: 2, name: "Lambdaci" },
        { dim: 3, name: "Q" },
        { dim: 4, name: "Delta" },
        { dim: 5, name: "Divergence" },
        { dim: 6, name: "Size" },
        { dim: 7, name: "Vorticity" },
        { dim: 8, name: "Enstrophy" },
        { dim: 9, name: "Velocity" },
        { dim: 10, name: "Acceleration" },
        { dim: 11, name: "Jacobian" },
        { dim: 12, name: "Curvature" },
        { dim: 13, name: "FullCurvature" },
        { dim: 14, name: "St" },
        { dim: 15, name: "Sp" },
        { dim: 16, name: "Sv" },
        { dim: 17, name: "Length" },
        { dim: 18, name: "Rho" }
      ],
      series: {
        type: "parallel",
        lineStyle: {
          width: 1,
        },
        data: formattedDataArray,
        animation :false
      },
    };

    // Set the chart option
    chart.setOption(option);

    // Click event handler for lines in the chart
    chart.on("click", function (params) {
      // params.dataIndex contains the index of the clicked line in the data array
      const clickedLineIndex = params.dataIndex;

      // Update line styles on click
      formattedDataArray[clickedLineIndex].lineStyle = {
        ...formattedDataArray[clickedLineIndex].lineStyle,
        color: "red",
        opacity: 1,
        width: 2,
      };

      for (let i = 0; i < formattedDataArray.length; i++) {
        if (i !== clickedLineIndex) {
          formattedDataArray[i].lineStyle = {
            ...formattedDataArray[i].lineStyle,
            color: "gray",
            opacity: 0.25,
            width: 0.5,
          };
        }
      }

      // Refresh the chart with updated styles
      chart.setOption({
        series: {
          data: formattedDataArray,
        },
      });
    });

    // Apply selected line styling if available
    if (selectedLine !== null) {
      formattedDataArray[selectedLine].lineStyle = {
        ...formattedDataArray[selectedLine].lineStyle,
        color: "red",
        opacity: 1,
        width: 2,
      };
    }

    // Cleanup function to dispose the chart
    return () => {
      chart.dispose();
    };
  }, [data, selectedNode]);

  return (
    <div>
      {/* Title */}
      <h2>Parallel Chart</h2>
      {/* Chart container */}
      <div ref={chartRef} style={{ width: "125%", height: "325px" }}></div>
    </div>
  );
};

export default ParallelChart;
