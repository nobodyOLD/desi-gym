'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Custom Tooltip component for dark theme
const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-xl">
        <p className="text-gray-400 text-xs font-semibold mb-1">{label}</p>
        <p className="text-white text-sm font-bold">
          {payload[0].name}: <span className="text-orange-500">{payload[0].value}</span> {unit}
        </p>
      </div>
    );
  }
  return null;
};

// 1. Weight Chart (Area Chart)
export function WeightChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <EmptyState text="No weight data logged yet" />;
  }

  // Format date labels
  const formattedData = data.map((d) => ({
    ...d,
    displayDate: new Date(d.log_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="weightColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="displayDate" stroke="#9ca3af" fontSize={11} tickLine={false} />
          <YAxis stroke="#9ca3af" fontSize={11} domain={['dataMin - 3', 'dataMax + 3']} tickLine={false} />
          <Tooltip content={<CustomTooltip unit="kg" />} />
          <Area
            type="monotone"
            dataKey="weight"
            name="Weight"
            stroke="#f97316"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#weightColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 2. Body Fat Chart (Line Chart)
export function BodyFatChart({ data = [] }) {
  const filteredData = data.filter((d) => d.body_fat_percentage !== null && d.body_fat_percentage > 0);

  if (filteredData.length === 0) {
    return <EmptyState text="No body fat data logged yet" />;
  }

  const formattedData = filteredData.map((d) => ({
    ...d,
    displayDate: new Date(d.log_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="displayDate" stroke="#9ca3af" fontSize={11} tickLine={false} />
          <YAxis stroke="#9ca3af" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} />
          <Tooltip content={<CustomTooltip unit="%" />} />
          <Line
            type="monotone"
            dataKey="body_fat_percentage"
            name="Body Fat"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, stroke: '#1e3a8a', strokeWidth: 2, fill: '#3b82f6' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 3. Energy Level Chart (Bar Chart)
export function EnergyChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <EmptyState text="No energy level records yet" />;
  }

  const formattedData = data.map((d) => ({
    ...d,
    displayDate: new Date(d.log_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="displayDate" stroke="#9ca3af" fontSize={11} tickLine={false} />
          <YAxis stroke="#9ca3af" fontSize={11} domain={[0, 10]} tickLine={false} />
          <Tooltip content={<CustomTooltip unit="/10" />} />
          <Bar dataKey="energy_level" name="Energy Level" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// 4. Measurements Radar Chart (Radar Chart)
export function MeasurementsRadar({ data = {} }) {
  const radarData = [
    { subject: 'Chest', A: data.chest_cm || 0, fullMark: 150 },
    { subject: 'Waist', A: data.waist_cm || 0, fullMark: 150 },
    { subject: 'Hips', A: data.hips_cm || 0, fullMark: 150 },
    { subject: 'Bicep', A: data.bicep_cm || 0, fullMark: 60 },
  ];

  const hasData = radarData.some((d) => d.A > 0);

  if (!hasData) {
    return <EmptyState text="No body measurements logged yet" />;
  }

  return (
    <div className="h-72 w-full flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
          <PolarGrid stroke="#4b5563" />
          <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={12} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#4b5563" fontSize={10} />
          <Radar
            name="Measurements"
            dataKey="A"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.3}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-gray-800 border border-gray-700 p-2.5 rounded-lg shadow-xl">
                    <p className="text-white text-xs font-bold">
                      {payload[0].payload.subject}: <span className="text-orange-500">{payload[0].value}</span> cm
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// 5. Macros Pie Chart
export function MacroPieChart({ protein = 0, carbs = 0, fat = 0 }) {
  const total = protein + carbs + fat;

  if (total === 0) {
    return <EmptyState text="No macros setup" />;
  }

  const data = [
    { name: 'Protein', value: protein, color: '#f97316' }, // orange
    { name: 'Carbs', value: carbs, color: '#3b82f6' }, // blue
    { name: 'Fat', value: fat, color: '#22c55e' }, // green
  ];

  return (
    <div className="h-64 w-full flex flex-col justify-center items-center">
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const totalGrams = protein + carbs + fat;
                const percentage = ((payload[0].value / totalGrams) * 100).toFixed(0);
                return (
                  <div className="bg-gray-800 border border-gray-700 p-2.5 rounded-lg shadow-xl">
                    <p className="text-white text-xs font-bold">
                      {payload[0].name}: <span className="text-orange-500">{payload[0].value}g</span> ({percentage}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-gray-300 text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Subcomponent for chart empty states
function EmptyState({ text }) {
  return (
    <div className="h-72 w-full border border-gray-700/50 border-dashed rounded-xl flex items-center justify-center bg-gray-900/30">
      <p className="text-gray-500 text-sm font-medium">{text}</p>
    </div>
  );
}
