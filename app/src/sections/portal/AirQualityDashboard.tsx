import { useState } from 'react';
import {
  Wind,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Mock data for charts
const hourlyData = [
  { time: '00:00', pm25: 12, pm10: 25, no2: 18, so2: 8 },
  { time: '04:00', pm25: 15, pm10: 30, no2: 22, so2: 10 },
  { time: '08:00', pm25: 35, pm10: 55, no2: 45, so2: 15 },
  { time: '12:00', pm25: 28, pm10: 48, no2: 38, so2: 12 },
  { time: '16:00', pm25: 42, pm10: 68, no2: 52, so2: 18 },
  { time: '20:00', pm25: 22, pm10: 38, no2: 28, so2: 10 },
  { time: '23:59', pm25: 18, pm10: 32, no2: 24, so2: 9 },
];

const weeklyData = [
  { day: 'Mon', aqi: 65 },
  { day: 'Tue', aqi: 72 },
  { day: 'Wed', aqi: 58 },
  { day: 'Thu', aqi: 85 },
  { day: 'Fri', aqi: 92 },
  { day: 'Sat', aqi: 45 },
  { day: 'Sun', aqi: 38 },
];

const stationData = [
  {
    id: 1,
    name: 'Dodoma CBD Station',
    location: 'City Center',
    status: 'online',
    aqi: 72,
    pm25: 35,
    pm10: 58,
    no2: 42,
    o3: 28,
    lastUpdate: '2 min ago',
  },
  {
    id: 2,
    name: 'Industrial Zone Station',
    location: 'Dodoma Industrial Park',
    status: 'online',
    aqi: 95,
    pm25: 48,
    pm10: 75,
    no2: 55,
    o3: 32,
    lastUpdate: '1 min ago',
  },
  {
    id: 3,
    name: 'Residential Area Station',
    location: 'Miyuji District',
    status: 'online',
    aqi: 45,
    pm25: 18,
    pm10: 32,
    no2: 22,
    o3: 35,
    lastUpdate: '3 min ago',
  },
  {
    id: 4,
    name: 'Highway Station',
    location: 'Morogoro Road',
    status: 'maintenance',
    aqi: null,
    pm25: null,
    pm10: null,
    no2: null,
    o3: null,
    lastUpdate: '2 hours ago',
  },
];

const getAQIColor = (aqi: number | null) => {
  if (aqi === null) return 'text-gray-400';
  if (aqi <= 50) return 'text-eco-400';
  if (aqi <= 100) return 'text-yellow-400';
  if (aqi <= 150) return 'text-orange-400';
  return 'text-red-400';
};

const getAQIBgColor = (aqi: number | null) => {
  if (aqi === null) return 'bg-gray-500/10';
  if (aqi <= 50) return 'bg-eco-500/10';
  if (aqi <= 100) return 'bg-yellow-500/10';
  if (aqi <= 150) return 'bg-orange-500/10';
  return 'bg-red-500/10';
};

const getAQILabel = (aqi: number | null) => {
  if (aqi === null) return 'Offline';
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  return 'Unhealthy';
};

export default function AirQualityDashboard() {
  const [selectedStation, setSelectedStation] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');

  const averageAQI = Math.round(
    stationData.filter((s) => s.aqi !== null).reduce((acc, s) => acc + (s.aqi || 0), 0) /
      stationData.filter((s) => s.aqi !== null).length
  );

  return (
    <div className="min-h-screen bg-[#0a1f12] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">
                Air Quality Dashboard
              </h1>
              <p className="text-gray-400 text-sm">
                Real-time air quality monitoring across Tanzania
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => window.location.hash = ''}
              className="text-gray-400 hover:text-eco-400 transition-colors"
            >
              ← Back to Home
            </Button>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36 bg-[#0f2e15] border-eco-500/30 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f2e15] border-eco-500/30">
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="btn-outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" className="btn-outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* AQI Overview Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className={`${getAQIBgColor(averageAQI)} border-eco-500/20`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average AQI</p>
                  <p className={`text-3xl font-heading font-bold ${getAQIColor(averageAQI)}`}>
                    {averageAQI}
                  </p>
                  <p className={`text-sm ${getAQIColor(averageAQI)}`}>
                    {getAQILabel(averageAQI)}
                  </p>
                </div>
                <Wind className={`w-10 h-10 ${getAQIColor(averageAQI)}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">PM2.5 Average</p>
                  <p className="text-3xl font-heading font-bold text-white">
                    32<span className="text-lg text-gray-400"> µg/m³</span>
                  </p>
                  <p className="text-sm text-yellow-400">Moderate</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Stations</p>
                  <p className="text-3xl font-heading font-bold text-white">
                    3<span className="text-lg text-gray-400">/4</span>
                  </p>
                  <p className="text-sm text-eco-400">Operational</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-eco-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-eco-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">24h Trend</p>
                  <p className="text-3xl font-heading font-bold text-white">
                    -8<span className="text-lg text-gray-400">%</span>
                  </p>
                  <p className="text-sm text-eco-400 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" />
                    Improving
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-eco-500/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-eco-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Hourly Trends */}
          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardHeader>
              <CardTitle className="text-white">Hourly Pollutant Levels</CardTitle>
              <CardDescription className="text-gray-400">
                PM2.5, PM10, NO2, and SO2 concentrations over 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a4d24" />
                    <XAxis dataKey="time" stroke="#6b7b6e" fontSize={12} />
                    <YAxis stroke="#6b7b6e" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f2e15',
                        border: '1px solid #1a4d24',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="pm25" stroke="#4ade80" strokeWidth={2} name="PM2.5" />
                    <Line type="monotone" dataKey="pm10" stroke="#22c55e" strokeWidth={2} name="PM10" />
                    <Line type="monotone" dataKey="no2" stroke="#3b82f6" strokeWidth={2} name="NO2" />
                    <Line type="monotone" dataKey="so2" stroke="#f59e0b" strokeWidth={2} name="SO2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly AQI */}
          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardHeader>
              <CardTitle className="text-white">Weekly AQI Trend</CardTitle>
              <CardDescription className="text-gray-400">
                Air Quality Index over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a4d24" />
                    <XAxis dataKey="day" stroke="#6b7b6e" fontSize={12} />
                    <YAxis stroke="#6b7b6e" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f2e15',
                        border: '1px solid #1a4d24',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="aqi"
                      stroke="#4ade80"
                      fill="url(#colorAqi)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monitoring Stations */}
        <Card className="bg-[#0f2e15] border-eco-500/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">Monitoring Stations</CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time data from all monitoring locations
                </CardDescription>
              </div>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger className="w-48 bg-[#0a1f12] border-eco-500/30 text-white">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select Station" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f2e15] border-eco-500/30">
                  <SelectItem value="all">All Stations</SelectItem>
                  {stationData.map((station) => (
                    <SelectItem key={station.id} value={station.id.toString()}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stationData.map((station) => (
                <div
                  key={station.id}
                  className={`p-4 rounded-xl border transition-all ${
                    station.status === 'online'
                      ? 'bg-[#0a1f12] border-eco-500/20 hover:border-eco-500/40'
                      : 'bg-gray-500/5 border-gray-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-white text-sm">{station.name}</h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {station.location}
                      </p>
                    </div>
                    <Badge
                      className={
                        station.status === 'online'
                          ? 'bg-eco-500/20 text-eco-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }
                    >
                      {station.status}
                    </Badge>
                  </div>

                  {station.status === 'online' ? (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">AQI</span>
                        <span className={`text-2xl font-bold ${getAQIColor(station.aqi)}`}>
                          {station.aqi}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">PM2.5</span>
                          <span className="text-white">{station.pm25}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">PM10</span>
                          <span className="text-white">{station.pm10}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">NO2</span>
                          <span className="text-white">{station.no2}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">O3</span>
                          <span className="text-white">{station.o3}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Info className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Station offline</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3">
                    Last update: {station.lastUpdate}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AQI Scale Reference */}
        <Card className="mt-6 bg-[#0f2e15] border-eco-500/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">AQI Scale Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { range: '0-50', label: 'Good', color: 'bg-eco-500', textColor: 'text-eco-400' },
                { range: '51-100', label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
                { range: '101-150', label: 'Unhealthy for Sensitive', color: 'bg-orange-500', textColor: 'text-orange-400' },
                { range: '151-200', label: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-400' },
                { range: '201-300', label: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-400' },
                { range: '301+', label: 'Hazardous', color: 'bg-red-900', textColor: 'text-red-600' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-3 rounded-lg bg-[#0a1f12] border border-eco-500/10"
                >
                  <div className={`w-full h-2 rounded-full ${item.color} mb-2`} />
                  <p className={`font-bold ${item.textColor}`}>{item.range}</p>
                  <p className="text-xs text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
