import React from 'react'
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
const data = [
  {
    "name": "January",
    "Profit": 4000,
    "Loss": 2400

  },
  {
    "name": "February",
    "Profit": 3000,
    "Loss": 1398

  },
  {
    "name": "March",
    "Profit": 2000,
    "Loss": 9800

  },
  {
    "name": "April",
    "Profit": 2780,
    "Loss": 3908

  },
  {
    "name": "May",
    "Profit": 1890,
    "Loss": 4800

  },
  {
    "name": "June",
    "Profit": 2390,
    "Loss": 3800

  },
  {
    "name": "July",
    "Profit": 3490,
    "Loss": 4300

  },
  {
    "name": "August",
    "Profit": 7000,
    "Loss": 4300

  },
  {
    "name": "September",
    "Profit": 7600,
    "Loss": 4700

  },
  {
    "name": "October",
    "Profit": 3990,
    "Loss": 5300

  },
  {
    "name": "November",
    "Profit": 8490,
    "Loss": 4900

  },
  {
    "name": "December",
    "Profit": 6490,
    "Loss": 3300

  }
]
const Linechart = () => {
  return (
    <div>
      <LineChart width={1200} height={300} data={data}
        margin={{ top: 5, right: 35, left: 10, bottom: 45 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} tickMargin={25} />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line type="monotone" dataKey="Profit" stroke="#8884d8" />
        <Line type="monotone" dataKey="Loss" stroke="#82ca9d" />
      </LineChart>
    </div>
  )
}

export default Linechart