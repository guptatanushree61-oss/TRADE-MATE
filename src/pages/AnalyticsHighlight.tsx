import React, { useState } from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function randomData(period: 'daily'|'weekly'|'monthly') {
  const days = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
  const rows = [] as Array<{ date: string; sales: number; sold: number; left: number }>;
  for (let i = 0; i < days; i++) {
    rows.push({ date: `Day ${i+1}`, sales: Math.floor(Math.random()*5000)+200, sold: Math.floor(Math.random()*200), left: Math.floor(Math.random()*500) });
  }
  return rows;
}

export const AnalyticsHighlight: React.FC = () => {
  const [period, setPeriod] = useState<'daily'|'weekly'|'monthly'>('daily');
  const data = randomData(period);

  const downloadCSV = () => {
    const csv = ['date,sales,stocks_sold,stocks_left', ...data.map(r => `${r.date},${r.sales},${r.sold},${r.left}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `highlight-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout pageTitle="Highlight">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Highlight - {period}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button variant={period==='daily'? 'default':'outline'} onClick={() => setPeriod('daily')}>Daily</Button>
              <Button variant={period==='weekly'? 'default':'outline'} onClick={() => setPeriod('weekly')}>Weekly</Button>
              <Button variant={period==='monthly'? 'default':'outline'} onClick={() => setPeriod('monthly')}>Monthly</Button>
              <Button className="ml-auto" onClick={downloadCSV}>Download CSV</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.slice(0,3).map((r, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg shadow">
                  <div className="text-sm text-muted-foreground">{r.date}</div>
                  <div className="text-xl font-bold">₹{r.sales.toLocaleString()}</div>
                  <div className="text-sm">Sold: {r.sold} • Left: {r.left}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default AnalyticsHighlight;
