import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { SidebarLayout } from '@/components/SidebarLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ReportType = 'daily' | 'weekly' | 'monthly';

const sampleData = {
  daily: {
    labels: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
    dataset: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
  },
  weekly: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    dataset: Array.from({ length: 4 }, () => Math.floor(Math.random() * 500)),
  },
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    dataset: Array.from({ length: 6 }, () => Math.floor(Math.random() * 2000)),
  },
};

export const Reports: React.FC = () => {
  const { t } = useLanguage();

  const reports = [
    {
      title: 'Sales Report',
      description: 'Monthly sales performance and trends',
      period: 'January 2024',
      growth: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Inventory Report',
      description: 'Stock levels and inventory turnover',
      period: 'Current Month',
      growth: '-2.3%',
      trend: 'down'
    },
    {
      title: 'Customer Report',
      description: 'Customer acquisition and retention metrics',
      period: 'Last 30 days',
      growth: '+8.1%',
      trend: 'up'
    },
    {
      title: 'Financial Report',
      description: 'Revenue, expenses, and profit analysis',
      period: 'Q1 2024',
      growth: '+15.2%',
      trend: 'up'
    }
  ];

  const [reportType, setReportType] = useState<ReportType>('daily');
  const [loading, setLoading] = useState(false);

  // wrap everything to export into one container for consistent layout
  const exportWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // placeholder: fetch real data per reportType
  }, [reportType]);

  const getChartData = () => {
    const d = sampleData[reportType];
    return {
      labels: d.labels,
      datasets: [
        {
          label: 'Progress',
          data: d.dataset,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.3)',
        },
      ],
    };
  };

  // helper: add page numbers
  const addPageNumbers = (doc: jsPDF) => {
    const pages = doc.getNumberOfPages();
    doc.setFontSize(9);
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.text(`Page ${i} of ${pages}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
    }
  };

  const generatePDFFromWrapper = async (openInNewTab = false) => {
    if (!exportWrapperRef.current) return;
    setLoading(true);

    try {
      // increase scale for better quality (memory cost)
      const scale = 2.2;
      const canvas = await html2canvas(exportWrapperRef.current, {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 12;
      const usableW = pageWidth - margin * 2;

      // compute image dimensions in mm (convert px -> mm using 96dpi assumption)
      const pxToMm = (px: number) => (px * 25.4) / 96;
      const imgWidthMm = usableW;
      const imgHeightMm = pxToMm(canvas.height) * (imgWidthMm / pxToMm(canvas.width));

      // if image fits one page, add and finish
      if (imgHeightMm <= (pageHeight - margin * 2)) {
        doc.addImage(imgData, 'JPEG', margin, margin, imgWidthMm, imgHeightMm);
      } else {
        // split long image across multiple pages
        // we'll slice canvas vertically
        const canvasW = canvas.width;
        const canvasH = canvas.height;
        const sliceHeightPx = Math.floor((pageHeight - margin * 2) * (96 / 25.4) * (canvas.width / (usableW * (96 / 25.4)))); // approximate px slice
        let remaining = canvasH;
        let sy = 0;
        while (remaining > 0) {
          const sliceH = Math.min(sliceHeightPx, remaining);
          const tmp = document.createElement('canvas');
          tmp.width = canvasW;
          tmp.height = sliceH;
          const ctx = tmp.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, sy, canvasW, sliceH, 0, 0, canvasW, sliceH);
            const sliceData = tmp.toDataURL('image/jpeg', 0.92);
            const sliceHeightMm = pxToMm(sliceH) * (imgWidthMm / pxToMm(canvas.width));
            doc.addImage(sliceData, 'JPEG', margin, margin, imgWidthMm, sliceHeightMm);
          }
          remaining -= sliceH;
          sy += sliceH;
          if (remaining > 0) doc.addPage();
        }
      }

      // add small footer/metadata on last page
      const generatedAt = new Date().toLocaleString();
      doc.setFontSize(9);
      doc.setTextColor('#666');
      doc.text(`Generated: ${generatedAt}`, margin, pageHeight - 8);

      addPageNumbers(doc);

      if (openInNewTab) {
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        doc.save(`progress-report-${reportType}.pdf`);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Failed to generate PDF. Try increasing memory or closing other tabs and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async () => generatePDFFromWrapper(true);
  const handleDownload = async () => generatePDFFromWrapper(false);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } as any, title: { display: true, text: `${reportType.toUpperCase()} Progress` } },
  };

  // small helpers for summary
  const total = sampleData[reportType].dataset.reduce((s, v) => s + v, 0);
  const avg = Math.round(total / sampleData[reportType].dataset.length);

  const handleDownloadOld = (reportTitle: string) => {
    const reportContent = `
TradeMate Business Report
Report: ${reportTitle}
Generated: ${new Date().toLocaleString()}
--------------------------------------

This is a sample report. In production, this would contain
detailed business analytics and data.
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportAllOld = () => {
    const allReportsContent = `
TradeMate Business Reports - Complete Export
Generated: ${new Date().toLocaleString()}
============================================

${reports.map(report => `
${report.title}
Period: ${report.period}
Growth: ${report.growth}
Description: ${report.description}
--------------------------------------
`).join('\n')}

Quick Statistics:
- Total Revenue (MTD): ₹1,24,500
- Total Orders: 348
- Customer Satisfaction: 89%
    `;
    
    const blob = new Blob([allReportsContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All_Reports_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout showBackButton pageTitle={t('nav.reports')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Business Reports</h2>
            <p className="text-muted-foreground">
              Generate and download comprehensive business reports
            </p>
          </div>
          <Button onClick={handleExportAllOld}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                  {report.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{report.period}</span>
                  <span className={`text-sm font-medium ${
                    report.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {report.growth}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Report
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadOld(report.title)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">₹1,24,500</p>
                <p className="text-sm text-muted-foreground">Total Revenue (MTD)</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">348</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">89%</p>
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EXPORT WRAPPER - everything inside this will be rendered into the PDF */}
        <div ref={exportWrapperRef} style={{ background: '#fff', color: '#111' }}>
          <div style={{ padding: 18, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>TradeMate — Progress Report</h1>
              <div style={{ color: '#6b7280', marginTop: 6 }}>
                <span style={{ marginRight: 12 }}>{new Date().toLocaleString()}</span>
                <span>Type: {reportType.toUpperCase()}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#374151' }}>Prepared for</div>
              <div style={{ fontWeight: 600 }}>Company / Team Name</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, padding: 18, alignItems: 'stretch' }}>
            <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Summary</h3>
              <div style={{ color: '#374151' }}>
                <p style={{ margin: '4px 0' }}>Total: <strong>{total}</strong></p>
                <p style={{ margin: '4px 0' }}>Average: <strong>{avg}</strong></p>
                <p style={{ margin: '4px 0' }}>Entries: <strong>{sampleData[reportType].dataset.length}</strong></p>
              </div>
            </div>

            <div style={{ width: 320, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Key Metrics</h3>
              <ul style={{ margin: 0, paddingLeft: 16, color: '#374151' }}>
                <li>Revenue Growth: <strong>+12.5%</strong></li>
                <li>Orders Change: <strong>-2.3%</strong></li>
                <li>Customer Satisfaction: <strong>89%</strong></li>
              </ul>
            </div>
          </div>

          <div style={{ padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <Line options={chartOptions} data={getChartData()} />
            </div>
            <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <Bar options={chartOptions} data={getChartData()} />
            </div>
          </div>

          <div style={{ padding: 18 }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Detailed Data</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: 8 }}>Label</th>
                  <th style={{ padding: 8 }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {sampleData[reportType].labels.map((lbl, idx) => (
                  <tr key={lbl} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: 8 }}>{lbl}</td>
                    <td style={{ padding: 8 }}>{sampleData[reportType].dataset[idx]}</td>
                  </tr>
                ))}
                {/* add totals row */}
                <tr style={{ fontWeight: 700 }}>
                  <td style={{ padding: 8 }}>Total</td>
                  <td style={{ padding: 8 }}>{total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* controls for export */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={handleView} disabled={loading}>
            View PDF
          </Button>
          <Button onClick={handleDownload} disabled={loading}>
            {loading ? 'Exporting...' : 'Export All (PDF)'}
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
};