import React from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Sparkles, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const dataArea = [
  { month: 'Jan', sales: 4000, visits: 2400 },
  { month: 'Feb', sales: 3000, visits: 1398 },
  { month: 'Mar', sales: 5000, visits: 9800 },
  { month: 'Apr', sales: 4780, visits: 3908 },
  { month: 'May', sales: 5890, visits: 4800 },
  { month: 'Jun', sales: 4390, visits: 3800 },
];

const dataBar = [
  { name: 'Rice', stock: 120 },
  { name: 'Oil', stock: 80 },
  { name: 'Sugar', stock: 30 },
  { name: 'Spices', stock: 60 },
];

const dataPie = [
  { name: 'In-store', value: 400 },
  { name: 'Online', value: 300 },
  { name: 'Wholesale', value: 300 },
];

const COLORS = ['#4F46E5', '#06B6D4', '#F97316'];

const Analytics: React.FC = () => {
  const { t } = useLanguage();

  const navigate = useNavigate();

  return (
    <SidebarLayout pageTitle="Analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 animate-fade-up">
          <div>
            <h2 className="text-2xl font-bold text-black">Analytics</h2>
            <p className="text-black/70">Visualize sales, traffic, and inventory trends.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/analytics/highlight')}><Sparkles className="h-4 w-4" /> Highlight</Button>
            <Button variant="outline" onClick={() => navigate('/analytics/compare')}><Layers className="h-4 w-4" /> Compare</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>Revenue and site visits</CardDescription>
            </CardHeader>
            <CardContent className="h-48 md:h-64 p-4">
              <ChartContainer
                config={{ sales: { label: 'Sales', color: 'linear-gradient(90deg,#4f46e5,#06b6d4)' }, visits: { label: 'Visits', color: '#06B6D4' } }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataArea} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#4F46E5" fill="url(#colorSales)" activeDot={{ r: 6 }} />
                    <Area type="monotone" dataKey="visits" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.08} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Sales Channels</CardTitle>
              <CardDescription>Where your customers come from</CardDescription>
            </CardHeader>
            <CardContent className="h-48 md:h-64 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Pie data={dataPie} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40} paddingAngle={4}>
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Levels</CardTitle>
              <CardDescription>Fast moving items</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={dataBar} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#4F46E5" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 hover:scale-105 transition-transform">
                  Rice — <span className="font-medium">120 sold</span>
                </li>
                <li className="p-3 rounded-lg bg-gradient-to-r from-secondary/5 to-secondary/10 hover:scale-105 transition-transform">
                  Oil — <span className="font-medium">80 sold</span>
                </li>
                <li className="p-3 rounded-lg bg-gradient-to-r from-accent/5 to-accent/10 hover:scale-105 transition-transform">
                  Sugar — <span className="font-medium">30 sold</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Peak sales in March — consider promotions in Feb.</div>
                <div>• Online conversion steady at 3.4%.</div>
                <div>• Low stock warnings for Sugar — reorder soon.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Analytics;
