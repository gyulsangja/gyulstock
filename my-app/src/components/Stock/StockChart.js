import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Customized,
  Rectangle,
} from 'recharts';


const CustomizedRectangle = (props) => {
  const { formattedGraphicalItems, data } = props;
  const firstSeries = formattedGraphicalItems[0];
  const secondSeries = formattedGraphicalItems[1];

  return firstSeries?.props?.points.map((firstSeriesPoint, index) => {
    const secondSeriesPoint = secondSeries?.props?.points[index];
    const yDifference = firstSeriesPoint.y - secondSeriesPoint.y

    return (
      <Rectangle
        key={`rectangle-${index}`}
        width={3}
        height={yDifference}
        x={secondSeriesPoint.x - 5}
        y={secondSeriesPoint.y}
        fill={data[index].fltRt > 0 ? '#8f0404' : data[index].fltRt < 0 ? '#06067d' : 'none'}
      />
    )
  })
};

const StockChart = (props) => {
  const reversedData = [...props.datas].reverse();
  const minPrice = Math.min(...props.datas.map(data => parseFloat(data.lopr)));
  const maxPrice = Math.max(...props.datas.map(data => parseFloat(data.hipr)));
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={500}
        height={400}
        data={reversedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="basDt"
          interval="preserveStart"
          tickFormatter={(value) => {
            const index = reversedData.findIndex(item => item.basDt === value);
            const date = reversedData[index]?.basDt;
            const formattedDate = date ? `${date.slice(2, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}` : '';
            return formattedDate;
          }}  
        />
        <YAxis domain={[minPrice * 0.9, maxPrice * 1.1]} />
        <Tooltip 
            labelFormatter={(value) => {
              const formattedDate = `${value.slice(2, 4)}/${value.slice(4, 6)}/${value.slice(6, 8)}`;
              return formattedDate;
            }} 
          />
        <Legend />
        <Line type="monotone" dataKey="clpr" stroke="#999999"  name='종가'/>
        <Line type="monotone" dataKey="hipr" stroke="#8884d8" name='고점'/>
        <Line type="monotone" dataKey="lopr" stroke="#82ca9d"  name='저점'/>
        
        <Customized component={<CustomizedRectangle data={reversedData} />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StockChart;