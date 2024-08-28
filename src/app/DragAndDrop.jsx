import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

import { mockAdData } from './data/mockData';
import Card from './components/Card';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function DragAndDrop() {
    const [reportData, setReportData] = useState([]);
    const [chartType, setChartType] = useState('bar');
    const [filteredData, setFilteredData] = useState(mockAdData.campaigns);
    const [filters, setFilters] = useState({ campaignName: '', deviceType: '' });
    const [availableMetrics, setAvailableMetrics] = useState(['Impressions', 'Clicks', 'Conversions', 'Cost', 'CTR', 'CPA']);

    const selectedMetric = 'Impressions';

    useEffect(() => {
        const { campaignName, deviceType } = filters;
        const filtered = mockAdData.campaigns.filter((campaign) =>
            (!campaignName || campaign.name.includes(campaignName)) &&
            (!deviceType || campaign.deviceType === deviceType)
        );
        setFilteredData(filtered);
    }, [filters]);

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        if (!reportData.includes(data)) {
            setReportData((prev) => [...prev, data]);
            setAvailableMetrics((prev) => prev.filter(metric => metric !== data));
        }
    };

    const handleChartTypeChange = (e) => setChartType(e.target.value);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelDropdownOption = (title) => {
        setReportData((prev) => prev.filter(elem => elem !== title));
        setAvailableMetrics((prev) => [...prev, title]);
    };

    const chartData = useMemo(() => ({
        labels: filteredData.map(campaign => campaign.name),
        datasets: [{
            label: selectedMetric,
            data: filteredData.map(campaign => campaign[selectedMetric.toLowerCase()]),
            backgroundColor: 'rgba(100, 149, 237, 0.6)',
        }],
    }), [filteredData, selectedMetric]);

    const pieChartData = useMemo(() => ({
        labels: reportData,
        datasets: [{
            label: 'Campaign Metrics',
            data: reportData.map(metric =>
                filteredData.reduce((acc, campaign) => acc + campaign[metric.toLowerCase()], 0)
            ),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
        }],
    }), [reportData, filteredData]);

    const pieChartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
            },
        },
    };

    let ChartComponent = chartType === 'bar' ? Bar : Line;

    return (
        <div className="container mx-auto my-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Ad Campaign Report Builder</h1>

            <div className="mb-4 flex items-center">
                <label className="mr-2 text-gray-700">Select Chart Type:</label>
                <select value={chartType} onChange={handleChartTypeChange} className="border p-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                </select>
            </div>

            <div className="mb-4 flex items-center">
                <label className="mr-2 text-gray-700">Filter by Device Types:</label>
                <select name="deviceType" onChange={handleFilterChange} className="border p-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <option value="">All Device Types</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Desktop">Desktop</option>
                </select>
                <input
                    type="text"
                    name="campaignName"
                    placeholder="Filter by Campaign Name"
                    onChange={handleFilterChange}
                    className="border p-2 mx-2 w-60 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>

            <div className="flex">
                <div
                    className="border-2 border-dashed border-blue-300 p-4 rounded-md mb-4 flex-1"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <p className="text-gray-700">Drag and drop available metrics here</p>
                    {reportData.map((elem, idx) => (
                        <div key={idx} className="bg-blue-100 p-2 rounded-md m-2 inline-block">
                            <Card title={elem} qty={idx} handleCancelDropdownOption={handleCancelDropdownOption} />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col ml-4">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Available Metrics</h2>
                    <div className="grid grid-cols-1 gap-2">
                        {availableMetrics.map((metric) => (
                            <div
                                key={metric}
                                className="bg-blue-100 p-4 rounded-md cursor-grab hover:bg-blue-200 transition"
                                draggable
                                onDragStart={(e) => e.dataTransfer.setData('text/plain', metric)}
                            >
                                {metric}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="mt-4">
                    <ChartComponent data={chartData} />
                </div>
                <div style={{ height: '500px' }} className='mx-auto'>
                    <Pie data={pieChartData} options={pieChartOptions} />
                </div>
            </div>
        </div>
    );
}