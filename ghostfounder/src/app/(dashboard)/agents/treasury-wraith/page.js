'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconReportMoney, 
  IconChartLine, 
  IconDownload,
  IconRefresh,
  IconCalendar,
  IconBrandGoogleDrive,
  IconCurrencyDollar,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertCircle,
  IconCheck,
  IconFileSpreadsheet,
  IconExternalLink,
  IconSparkles
} from '@tabler/icons-react';

export default function TreasuryWraithPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/agents/treasury-wraith');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
        if (data.reports?.length > 0) {
          setSelectedReport(data.reports[0]);
        }
      }
    } catch {
      console.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/agents/treasury-wraith', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setReports(prev => [data.report, ...prev]);
        setSelectedReport(data.report);
      } else {
        console.error('Failed to generate report:', data.error);
      }
    } catch {
      console.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-ghost-gold/20 to-ghost-gold/5 flex items-center justify-center border border-ghost-gold/30">
              <IconReportMoney className="w-8 h-8 text-ghost-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Treasury Wraith</h1>
              <p className="text-gray-400">AI-Powered Financial Analysis & Reporting</p>
            </div>
          </div>
          
          <button
            onClick={fetchReports}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <IconRefresh className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Report Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6 mb-8"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Generate New Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ghost-gold/50"
            >
              <option value="monthly">Monthly Report</option>
              <option value="quarterly">Quarterly Report</option>
              <option value="annual">Annual Report</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          {/* Start Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ghost-gold/50"
            />
          </div>
          
          {/* End Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ghost-gold/50"
            />
          </div>
          
          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={generating}
              className="w-full px-6 py-2 bg-ghost-gold text-black font-semibold rounded-lg hover:bg-ghost-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <IconSparkles className="w-5 h-5 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <IconChartLine className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Reports</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-ghost-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <IconFileSpreadsheet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No reports yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Generate your first financial report above
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {reports.map((report, i) => (
                <motion.div
                  key={report._id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedReport?._id === report._id 
                      ? 'border-ghost-gold bg-ghost-gold/10' 
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium capitalize">
                      {report.type} Report
                    </span>
                    {report.status === 'completed' ? (
                      <IconCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      <IconAlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <IconCalendar className="w-4 h-4" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                  {report.googleSheetUrl && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-ghost-blue">
                      <IconBrandGoogleDrive className="w-3 h-3" />
                      Google Sheet
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Report Details */}
        <div className="lg:col-span-2 bg-ghost-dark/50 border border-white/10 rounded-xl p-6">
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div
                key={selectedReport._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Report Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white capitalize">
                      {selectedReport.type} Financial Report
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {new Date(selectedReport.startDate).toLocaleDateString()} - {new Date(selectedReport.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedReport.googleSheetUrl && (
                      <a
                        href={selectedReport.googleSheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-ghost-blue"
                      >
                        <IconExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400">
                      <IconDownload className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Key Metrics */}
                {selectedReport.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { 
                        label: 'Revenue', 
                        value: selectedReport.metrics.revenue, 
                        change: selectedReport.metrics.revenueChange,
                        icon: IconCurrencyDollar 
                      },
                      { 
                        label: 'Expenses', 
                        value: selectedReport.metrics.expenses, 
                        change: selectedReport.metrics.expensesChange,
                        icon: IconTrendingDown 
                      },
                      { 
                        label: 'Profit', 
                        value: selectedReport.metrics.profit, 
                        change: selectedReport.metrics.profitChange,
                        icon: IconTrendingUp 
                      },
                      { 
                        label: 'Burn Rate', 
                        value: selectedReport.metrics.burnRate, 
                        icon: IconChartLine 
                      }
                    ].map((metric, i) => (
                      <div 
                        key={metric.label}
                        className="bg-white/5 border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <metric.icon className="w-5 h-5 text-ghost-gold" />
                          {metric.change !== undefined && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              metric.change >= 0 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {formatPercentage(metric.change)}
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {formatCurrency(metric.value || 0)}
                        </p>
                        <p className="text-sm text-gray-400">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Analysis */}
                {selectedReport.analysis && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">AI Analysis</h3>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {selectedReport.analysis}
                      </p>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {selectedReport.recommendations && selectedReport.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
                    <div className="space-y-2">
                      {selectedReport.recommendations.map((rec, i) => (
                        <div 
                          key={i}
                          className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-ghost-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-ghost-gold font-bold">{i + 1}</span>
                          </div>
                          <p className="text-gray-300">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expense Breakdown */}
                {selectedReport.expenseBreakdown && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Expense Breakdown</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedReport.expenseBreakdown).map(([category, amount]) => {
                        const total = Object.values(selectedReport.expenseBreakdown).reduce((a, b) => a + b, 0);
                        const percentage = (amount / total) * 100;
                        return (
                          <div key={category}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-400 capitalize">{category}</span>
                              <span className="text-white">{formatCurrency(amount)}</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-ghost-gold transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <IconReportMoney className="w-20 h-20 text-gray-600 mb-4" />
                <p className="text-gray-400">Select a report to view details</p>
                <p className="text-gray-500 text-sm mt-2">
                  Or generate a new financial report above
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
