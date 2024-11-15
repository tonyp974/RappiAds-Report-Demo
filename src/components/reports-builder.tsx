'use client'
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar, AreaChart, Area } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Download, Calendar, FileText, Brain, BrainCircuit } from 'lucide-react';

const CAMPAIGNS = {
  'Dia de los Muertos': {
    products: ['Sponsored Products', 'Sponsored Brands'],
    dateRange: { 
      start: new Date('2024-10-25'),
      end: new Date('2024-11-02')
    }
  },
  'Dia de Independencia': {
    products: ['Sponsored Products', 'Vertical Banners'],
    dateRange: {
      start: new Date('2024-09-13'),
      end: new Date('2024-09-16')
    }
  },
  'Black Friday': {
    products: ['Sponsored Products', 'Sponsored Brands', 'Vertical Banners'],
    dateRange: {
      start: new Date('2024-11-22'),
      end: new Date('2024-11-24')
    }
  }
};

const DatePresets = {
  'Today': [new Date(), new Date()],
  'Yesterday': [new Date(Date.now() - 86400000), new Date(Date.now() - 86400000)],
  'Last 7 Days': [new Date(Date.now() - 7 * 86400000), new Date()],
  'Last 30 Days': [new Date(Date.now() - 30 * 86400000), new Date()],
  'This Month': [new Date(new Date().setDate(1)), new Date()],
  'Last Month': [new Date(new Date().setMonth(new Date().getMonth() - 1, 1)), new Date(new Date().setDate(0))]
};

export function ReportBuilder() {
  const [data, setData] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [metrics, setMetrics] = useState({
    Impressions: true,
    Clicks: true,
    CPM: false,
    CPC: false,
    Spend: true,
    ROAS: false,
    Sales: false,
    Orders: false
  });
  const [productGroups, setProductGroups] = useState({
    'Sponsored Products': true,
    'Sponsored Brands': true,
    'Vertical Banners': true
  });
  const [dateRange, setDateRange] = useState({
    start: DatePresets['Last 30 Days'][0],
    end: DatePresets['Last 30 Days'][1]
  });
  const [viewName, setViewName] = useState('');
  const [savedViews, setSavedViews] = useState([]);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    if (selectedCampaign) {
      const campaignProducts = CAMPAIGNS[selectedCampaign].products;
      setProductGroups(prev => 
        Object.keys(prev).reduce((acc, group) => ({
          ...acc,
          [group]: campaignProducts.includes(group)
        }), {})
      );
      setDateRange(CAMPAIGNS[selectedCampaign].dateRange);
    }
  }, [selectedCampaign]);

  useEffect(() => {
    const generateData = () => {
      const data = [];
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayData = {
          date: d.toISOString().split('T')[0],
          'Sponsored Products': {
            Impressions: Math.floor(Math.random() * 50000) + 10000,
            Clicks: Math.floor(Math.random() * 5000) + 1000,
            Spend: Math.floor(Math.random() * 1000) + 500,
            CPM: Math.random() * 10 + 5,
            CPC: Math.random() * 2 + 0.5,
            ROAS: Math.random() * 4 + 1,
            Sales: Math.floor(Math.random() * 10000) + 5000,
            Orders: Math.floor(Math.random() * 500) + 100
          },
          'Sponsored Brands': {
            Impressions: Math.floor(Math.random() * 30000) + 5000,
            Clicks: Math.floor(Math.random() * 3000) + 500,
            Spend: Math.floor(Math.random() * 800) + 300,
            CPM: Math.random() * 8 + 4,
            CPC: Math.random() * 1.5 + 0.4,
            ROAS: Math.random() * 3 + 1,
            Sales: Math.floor(Math.random() * 8000) + 3000,
            Orders: Math.floor(Math.random() * 300) + 50
          },
          'Vertical Banners': {
            Impressions: Math.floor(Math.random() * 20000) + 3000,
            Clicks: Math.floor(Math.random() * 2000) + 300,
            Spend: Math.floor(Math.random() * 500) + 200,
            CPM: Math.random() * 6 + 3,
            CPC: Math.random() * 1 + 0.3,
            ROAS: Math.random() * 2.5 + 1,
            Sales: Math.floor(Math.random() * 5000) + 2000,
            Orders: Math.floor(Math.random() * 200) + 30
          }
        };
        data.push(dayData);
      }
      return data;
    };

    setData(generateData());
  }, [dateRange]);

  const handleExportRawData = () => {
    const selectedMetricsList = Object.entries(metrics)
      .filter(([_, isSelected]) => isSelected)
      .map(([metric]) => metric);
      
    const selectedProductGroupsList = Object.entries(productGroups)
      .filter(([_, isSelected]) => isSelected)
      .map(([group]) => group);
    
    const headers = ['Date', ...selectedProductGroupsList.flatMap(group => 
      selectedMetricsList.map(metric => `${group} - ${metric}`)
    )];
    
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const csvRow = [row.date];
      selectedProductGroupsList.forEach(group => {
        selectedMetricsList.forEach(metric => {
          csvRow.push(row[group][metric]);
        });
      });
      csvRows.push(csvRow.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `rappiads-report-${dateRange.start.toISOString().split('T')[0]}-${dateRange.end.toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveView = () => {
    if (!viewName) return;
    const newView = {
      name: viewName,
      metrics: {...metrics},
      productGroups: {...productGroups},
      dateRange: {...dateRange},
      campaign: selectedCampaign
    };
    setSavedViews([...savedViews, newView]);
    setViewName('');
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {showSaveAlert && (
        <div className="mb-4 bg-green-50 border-green-200 text-green-800 p-4 rounded-lg">
          View saved successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border-t-4 border-t-blue-500 p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-6">RappiAds Report Builder</h2>
        
        <div className="space-y-6">
          {/* Campaigns */}
          <div>
            <h3 className="font-medium text-lg text-blue-700 mb-3">
              <span className="bg-blue-100 p-2 rounded-lg">Campaigns</span>
            </h3>
            <div className="flex gap-4">
              {Object.keys(CAMPAIGNS).map(campaign => (
                <div
                  key={campaign}
                  onClick={() => setSelectedCampaign(selectedCampaign === campaign ? null : campaign)}
                  className={'px-4 py-2 rounded-lg cursor-pointer transition-colors ' + 
                    (selectedCampaign === campaign ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200')
                  }
                >
                  {campaign}
                </div>
              ))}
            </div>
          </div>

          {/* Product Groups */}
          <div>
            <h3 className="font-medium text-lg text-blue-700 mb-3">
              <span className="bg-blue-100 p-2 rounded-lg">Product Groups</span>
              {selectedCampaign && (
                <span className="ml-2 text-sm text-blue-600">
                  (Filtered by {selectedCampaign} campaign)
                </span>
              )}
            </h3>
            <div className="flex gap-4">
              {['Sponsored Products', 'Sponsored Brands', 'Vertical Banners'].map(group => (
                <div
                  key={group}
                  onClick={() => !selectedCampaign && setProductGroups(prev => ({...prev, [group]: !prev[group]}))}
                  className={'px-4 py-2 rounded-lg cursor-pointer transition-colors ' +
                    (productGroups[group] ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200') +
                    (selectedCampaign ? ' cursor-not-allowed' : '')
                  }
                >
                  {group}
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div>
            <h3 className="font-medium text-lg text-blue-700 mb-3">
              <span className="bg-blue-100 p-2 rounded-lg">Metrics</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(metrics).map(([metric, isSelected]) => (
                <div
                  key={metric}
                  onClick={() => setMetrics(prev => ({...prev, [metric]: !prev[metric]}))}
                  className={'px-4 py-2 rounded-lg cursor-pointer transition-colors ' +
                    (isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200')
                  }
                >
                  {metric}
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="font-medium text-lg text-blue-700 mb-3">
              <span className="bg-blue-100 p-2 rounded-lg">Date Range</span>
              {selectedCampaign && (
                <span className="ml-2 text-sm text-blue-600">
                  (Set by {selectedCampaign} campaign)
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {!selectedCampaign && Object.entries(DatePresets).map(([preset, [start, end]]) => (
                <Button
                  key={preset}
                  variant="outline"
                  onClick={() => setDateRange({ start, end })}
                  className={
                    dateRange.start === start && dateRange.end === end
                      ? 'bg-blue-500 text-white'
                      : ''
                  }
                >
                  {preset}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateRange.start.toISOString().split('T')[0]}
                onChange={(e) => !selectedCampaign && setDateRange(prev => ({
                  ...prev,
                  start: new Date(e.target.value)
                }))}
                disabled={selectedCampaign}
              />
              <Input
                type="date"
                value={dateRange.end.toISOString().split('T')[0]}
                onChange={(e) => !selectedCampaign && setDateRange(prev => ({
                  ...prev,
                  end: new Date(e.target.value)
                }))}
                disabled={selectedCampaign}
              />
            </div>
          </div>

          {/* Export and Save View */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => alert('PDF export functionality coming soon!')}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={handleExportRawData}>
                <Download className="w-4 h-4 mr-2" />
                Export Raw Data
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                className="w-48"
                placeholder="Enter view name"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
              />
              <Button onClick={handleSaveView} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-purple-500 p-6">
        <div className="flex items-center mb-4">
          <BrainCircuit className="w-6 h-6 mr-2 text-purple-500" />
          <h2 className="text-xl font-bold">AI Insights</h2>
        </div>
        <div className="space-y-4">
          <Textarea
            placeholder="Ask me anything about your data! Example: 'What are the key trends in the last 30 days?' or 'Create a chart showing the correlation between clicks and sales'"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={() => setAiResponse("Based on the data analysis, I've noticed several key trends: 1) Click-through rates have improved by 15% over the selected period, 2) Sponsored Products show the strongest ROAS at 2.8, and 3) There's a strong correlation between increased impressions and sales growth.")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>
          {aiResponse && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              {aiResponse}
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Consolidated View</h2>
        <ComposedChart width={800} height={400} data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.entries(metrics)
            .filter(([_, isSelected]) => isSelected)
            .map(([metric]) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={(datum) => 
                  Object.entries(productGroups)
                    .filter(([_, isSelected]) => isSelected)
                    .reduce((sum, [group]) => sum + datum[group][metric], 0)
                }
                name={metric}
                stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
              />
            ))}
        </ComposedChart>
      </div>

      {/* Individual Metric Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(metrics)
          .filter(([_, isSelected]) => isSelected)
          .map(([metric]) => (
            <div key={metric} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">{metric}</h2>
              <AreaChart width={400} height={300} data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.entries(productGroups)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([group]) => (
                    <Area
                      key={group}
                      type="monotone"
                      dataKey={(datum) => datum[group][metric]}
                      name={group}
                      fill={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                      fillOpacity={0.3}
                    />
                  ))}
              </AreaChart>
            </div>
          ))}
      </div>
    </div>
  );
}