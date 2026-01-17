import React from 'react';
import {
    ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar,
    LabelList
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { CHART_CONFIG } from '../chartConfig';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const LossMitigation = ({ data }) => {
    if (!data || !data.lossMitigation) return null;
    const { lossMitigation } = data;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Loss Mitigation Performance</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Tracking assistance programs, volume trends, and processing efficiency.</p>
                </div>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1rem',
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: 'var(--text-main)'
                }}>
                    <Filter size={16} />
                    <span>Program Filter</span>
                </button>
            </div>



            {/* KPI Row */}
            <div className="kpi-grid">
                {lossMitigation.kpis.map((kpi, i) => (
                    <div className="card" key={i}>
                        <div className="kpi-label" title={kpi.label}>{kpi.label}</div>
                        <div className="kpi-value">{kpi.value}</div>
                        <div className={`kpi-trend ${kpi.up === null ? '' : kpi.up ? 'trend-up' : 'trend-down'}`}>
                            {kpi.up === true && <ArrowUpRight size={12} />}
                            {kpi.up === false && <ArrowDownRight size={12} />}
                            <span>{kpi.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
                {/* Assistance Program Distribution (Donut) - 4 columns */}
                <div className="card chart-card span-4">
                    <div className="chart-header">
                        <h3 className="chart-title">Program Distribution</h3>
                    </div>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={lossMitigation.programDistribution}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                >
                                    {lossMitigation.programDistribution && lossMitigation.programDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Assistance Volume Trend (Line) - 8 columns */}
                <div className="card chart-card span-8">
                    <div className="chart-header">
                        <h3 className="chart-title">Assistance Volume Trend</h3>
                    </div>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lossMitigation.volumeTrend} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} label={{ value: 'Timeline', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Case Volume', ...CHART_CONFIG.yLabel }} />
                                <Tooltip />
                                <Line type="monotone" name="Total Requests" dataKey="requests" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }}>
                                    <LabelList dataKey="requests" position="top" style={{ fontSize: '10px', fill: 'var(--text-main)', fontWeight: 600 }} />
                                </Line>
                                <Line type="monotone" name="Resolved/Completed" dataKey="completed" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }}>
                                    <LabelList dataKey="completed" position="bottom" style={{ fontSize: '10px', fill: 'var(--text-main)', fontWeight: 600 }} />
                                </Line>
                                <Legend verticalAlign="top" align="right" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Status Breakdown (Stacked Bar) - Half Width */}
                <div className="card chart-card span-6">
                    <div className="chart-header" style={{ marginBottom: '0.75rem' }}>
                        <h3 className="chart-title">Customer Status Breakdown</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Workload Flow by Program Lifecycle Stage</span>
                    </div>

                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={lossMitigation.statusBreakdown}
                                margin={{ top: 20, right: 30, left: 30, bottom: CHART_CONFIG.marginBottom + 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} label={{ value: 'Workload Volume', ...CHART_CONFIG.xLabel, position: 'bottom', offset: 0 }} />
                                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-main)', fontWeight: 600 }} width={70} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
                                <Bar dataKey="doc" name="Documentation" fill="#6366f1" stackId="a">
                                    <LabelList dataKey="doc" position="center" style={{ fill: 'white', fontSize: '10px', fontWeight: 700 }} />
                                </Bar>
                                <Bar dataKey="review" name="Under Review" fill="#10b981" stackId="a">
                                    <LabelList dataKey="review" position="center" style={{ fill: 'white', fontSize: '10px', fontWeight: 700 }} />
                                </Bar>
                                <Bar dataKey="final" name="Final Decision" fill="#f59e0b" stackId="a" radius={[0, 4, 4, 0]}>
                                    <LabelList dataKey="final" position="right" style={{ fill: 'var(--text-main)', fontSize: '10px', fontWeight: 700 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Assistance Duration Distribution (Histogram) - Half Width */}
                <div className="card chart-card span-6">
                    <div className="chart-header">
                        <h3 className="chart-title">Assistance Duration Distribution</h3>
                    </div>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={lossMitigation.durationDistribution} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} fontSize={12} label={{ value: 'Duration (Days)', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Account Count', ...CHART_CONFIG.yLabel }} />
                                <Tooltip />
                                <Bar dataKey="count" name="Accounts" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="count" position="top" style={{ fill: 'var(--text-main)', fontSize: '12px', fontWeight: 600 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LossMitigation;
