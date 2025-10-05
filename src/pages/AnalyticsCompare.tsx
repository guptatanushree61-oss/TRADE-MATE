import React, { useState } from 'react';
import { SidebarLayout } from '@/components/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function generateCompare(period: 'daily'|'weekly'|'monthly') {
  const rows = [] as Array<{ label: string; salesA: number; salesB: number; soldA: number; soldB: number }>;
  const count = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
  for (let i = 0; i < count; i++) {
    rows.push({ label: `D${i+1}`, salesA: Math.floor(Math.random()*5000), salesB: Math.floor(Math.random()*5000), soldA: Math.floor(Math.random()*200), soldB: Math.floor(Math.random()*200) });
  }
  return rows;
}

export const AnalyticsCompare: React.FC = () => {
  const [period, setPeriod] = useState<'daily'|'weekly'|'monthly'>('daily');
  const data = generateCompare(period);

  const downloadCSV = () => {
    const csv = ['label,salesA,salesB,soldA,soldB', ...data.map(r => `${r.label},${r.salesA},${r.salesB},${r.soldA},${r.soldB}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compare-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout pageTitle="Compare">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Compare - {period}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button variant={period==='daily'? 'default':'outline'} onClick={() => setPeriod('daily')}>Daily</Button>
              <Button variant={period==='weekly'? 'default':'outline'} onClick={() => setPeriod('weekly')}>Weekly</Button>
              <Button variant={period==='monthly'? 'default':'outline'} onClick={() => setPeriod('monthly')}>Monthly</Button>
              <Button className="ml-auto" onClick={downloadCSV}>Download CSV</Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {data.slice(0,5).map((r, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg shadow flex justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{r.label}</div>
                    <div className="text-base">A: ₹{r.salesA.toLocaleString()} ({r.soldA} sold)</div>
                    <div className="text-base">B: ₹{r.salesB.toLocaleString()} ({r.soldB} sold)</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default AnalyticsCompare;
