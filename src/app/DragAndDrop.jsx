import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

import Card from './components/Card';
import { mockAdData } from './data/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function DragAndDrop() {
    const [reportData, setReportData] = useState([]);
    const [chartType, setChartType] = useState('bar');
    const [filteredData, setFilteredData] = useState(mockAdData.campaigns);
    const [filters, setFilters] = useState({ campaignName: '', deviceType: '' });
    const [availableMetrics, setAvailableMetrics] = useState(['Impressions', 'Clicks', 'Conversions', 'Cost', 'CTR', 'CPA']);
    const [chartData, setChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [comparisonMode, setComparisonMode] = useState(false);
    const [comparisonData, setComparisonData] = useState([]);
    const selectedMetric = 'Impressions';

    useEffect(() => {
        const { campaignName, deviceType } = filters;
        const filtered = mockAdData.campaigns.filter((campaign) => {
            const withinDateRange = (!startDate || new Date(campaign.date) >= new Date(startDate)) &&
                (!endDate || new Date(campaign.date) <= new Date(endDate));
            return (
                withinDateRange &&
                (!campaignName || campaign.name.includes(campaignName)) &&
                (!deviceType || campaign.deviceType === deviceType)
            );
        });
        setFilteredData(filtered);
    }, [filters, startDate, endDate]);

    const updateChartData = () => {
        const data = filteredData.map(campaign => campaign[selectedMetric.toLowerCase()]);
        setChartData({
            labels: filteredData.map(campaign => campaign.name),
            datasets: [
                {
                    label: selectedMetric,
                    data: data,
                    backgroundColor: 'rgba(100, 149, 237, 0.6)',
                },
                ...(comparisonMode
                    ? comparisonData.map((campaign, index) => ({
                        label: `Comparison ${index + 1}`,
                        data: campaign.map(c => c[selectedMetric.toLowerCase()]),
                        backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`,
                    }))
                    : []),
            ],
        });
    };

    const updatePieChartData = () => {
        const data = reportData.map(metric =>
            filteredData.reduce((acc, campaign) => acc + campaign[metric.toLowerCase()], 0)
        );
        setPieChartData({
            labels: reportData,
            datasets: [{
                label: 'Campaign Metrics',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
            }],
        });
    };

    useEffect(() => {
        updateChartData();
        updatePieChartData();
    }, [filteredData, reportData, comparisonMode, comparisonData]);

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

    const handleComparisonModeToggle = () => {
        setComparisonMode(prev => !prev);
    };

    const handleComparisonDataAdd = () => {
        setComparisonData(prev => [...prev, filteredData]);
    };

    const handleComparisonDataRemove = (index) => {
        setComparisonData(prev => prev.filter((_, idx) => idx !== index));
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

            <div className="mb-4 flex items-center">
                <label className="mr-2 text-gray-700">Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2 mx-2 rounded"
                />
                <label className="mr-2 text-gray-700">End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border p-2 mx-2 rounded"
                />
            </div>
            <div className="mb-4 flex items-center">
                <button onClick={handleComparisonModeToggle} className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition mr-4 ${comparisonMode ? 'bg-red-500 hover:bg-red-600' : ''}`}>
                    {comparisonMode ? 'Disable' : 'Enable'} Comparison Mode
                </button>
                {comparisonMode && (
                    <button onClick={handleComparisonDataAdd} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
                        Add Comparison Data
                    </button>
                )}
            </div>

            {comparisonMode && (
                <div className="mb-4 flex item-center flex-wrap">
                    {comparisonData.map((_, index) => (
                        <div key={index} className="bg-gray-200 p-4 rounded mb-2 flex item-center">
                            <p className="font-bold">Comparison {index + 1}</p>
                            <button onClick={() => handleComparisonDataRemove(index)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition float-right mx-2">
                                <svg className="w-3 h-3 rounded-full" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
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
                                <div className="flex items-center">
                                    <Image
                                        src="/adsense.png"
                                        alt='image-adsense'
                                        className="w-4 h-4 object-cover rounded-md mr-4 bg-transparent"
                                        width={4}
                                        height={4}
                                        priority
                                    /> {metric}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="mt-4">
                    {chartData && <ChartComponent data={chartData} />}
                </div>
                <div style={{ height: '500px' }} className='mx-auto'>
                    {pieChartData && <Pie data={pieChartData} options={{ plugins: { legend: { display: true, position: 'right' } } }} />}
                </div>
            </div>
        </div>
    );
}