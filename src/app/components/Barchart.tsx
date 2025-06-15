"use client";
import React from 'react'
import { BarChart, Bar, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
const data = [
    {
      "name": "January",
      "PC": 4000,
      "OPC": 2400
    },
    {
      "name": "February",
      "PC": 3000,
      "OPC": 1398
    },
    {
      "name": "March",
      "PC": 2000,
      "OPC": 9800
    },
    {
      "name": "April",
      "PC": 2780,
      "OPC": 3908
    },
    {
      "name": "May",
      "PC": 1890,
      "OPC": 4800
    },
    {
      "name": "June",
      "PC": 2390,
      "OPC": 3800
    }
   
  ]
const Barchart = () => {
    return (
        <div>
          <ResponsiveContainer width={1000} height={300}>
            <BarChart  data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={10} />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign='top' height={36} />
                <Bar dataKey="PC" fill="#8884d8" />
                <Bar dataKey="OPC" fill="#82ca9d" />
            </BarChart>
            </ResponsiveContainer>
        </div>

    )
}

export default Barchart;

