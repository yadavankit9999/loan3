import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    ComposedChart, Bar,
    BarChart,
    LabelList
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, AlertCircle, ShieldCheck, FileText, UserCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CHART_CONFIG } from '../chartConfig';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const KPICard = ({ label, value, trend, up }) => (
    <div className="card">
        <div className="kpi-label" title={label}>{label}</div>
        <div className="kpi-value">{value}</div>
        <div className={`kpi-trend ${up === null ? '' : up ? 'trend-up' : 'trend-down'}`}>
            {up === true && <ArrowUpRight size={12} />}
            {up === false && <ArrowDownRight size={12} />}
            <span>{trend}</span>
        </div>
    </div>
);

const SectionHeader = ({ title }) => (
    <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
    </div>
);

const LoanPerformance = ({ data }) => {
    if (!data || !data.performance) return null;
    const { kpis, delinquencyTrend, statusDistribution, valueVsRisk, scoreBuckets, riskSegments } = data.performance;

    return (
        <div style={{ padding: '0 1rem', animation: 'fadeIn 0.5s ease-out' }}>
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Loan Performance Trends</h2>
                <p style={{ color: 'var(--text-muted)' }}>Detailed analysis of portfolio health, delinquency movements, and risk exposure.</p>
            </div>

            <div className="kpi-grid">
                {kpis.map((kpi, i) => (
                    <KPICard key={i} {...kpi} />
                ))}
            </div>

            <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="chart-card span-6">
                    <SectionHeader title="Portfolio Delinquency Trend" />
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={delinquencyTrend} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} label={{ value: 'Month', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} width={CHART_CONFIG.yAxisWidth} unit="%" label={{ value: 'Rate (%)', ...CHART_CONFIG.yLabel }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`${value}%`, 'Delinquency Rate']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: 'var(--primary)' }}
                                >
                                    <LabelList dataKey="rate" position="top" formatter={(v) => `${v}%`} style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card span-6">
                    <SectionHeader title="Loan Status Distribution" />
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="chart-card span-6">
                    <SectionHeader title="Portfolio Value vs Risk by Region" />
                    <div style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={valueVsRisk} margin={{ top: 10, right: CHART_CONFIG.marginRight + 20, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} label={{ value: 'Region', ...CHART_CONFIG.xLabel }} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Value ($M)', ...CHART_CONFIG.yLabel }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} unit="%" label={{ value: 'Avg Risk (%)', angle: 90, position: 'insideRight', fontSize: 10, offset: 15 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="top" align="right" />
                                <Bar yAxisId="left" dataKey="value" name="Portfolio Value ($M)" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="value" position="top" formatter={(v) => `$${v}m`} style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                                <Line yAxisId="right" type="monotone" dataKey="riskRate" name="Average Risk %" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }}>
                                    <LabelList dataKey="riskRate" position="top" formatter={(v) => `${v}%`} style={{ fontSize: '10px', fontWeight: 600, fill: '#ef4444' }} />
                                </Line>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card span-6">
                    <SectionHeader title="Credit Score Distribution (Active Portfolio)" />
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scoreBuckets} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} label={{ value: 'Credit Score Bucket', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Loan Count', ...CHART_CONFIG.yLabel }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" name="Accounts" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="count" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card full-width">
                    <SectionHeader title="Risk Segment Breakdown" />
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Segment Category</th>
                                    <th>Loan Count</th>
                                    <th>Avg Delinquency</th>
                                    <th>Vulnerability Score</th>
                                    <th>Action Required</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riskSegments.map((segment, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600 }}>{segment.name}</td>
                                        <td>{segment.count}</td>
                                        <td>{segment.avgDelinquency} Days</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ flex: 1, height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${segment.vulnerability}%`, background: segment.vulnerability > 70 ? '#ef4444' : '#f59e0b' }} />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{segment.vulnerability}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${segment.vulnerability > 70 ? 'badge-danger' : 'badge-warning'}`}>
                                                {segment.vulnerability > 70 ? 'Immediate Audit' : 'Periodic Review'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default LoanPerformance;
