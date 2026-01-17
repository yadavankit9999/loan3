import React from 'react';
import {
    ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar,
    ComposedChart,
    Area,
    LabelList
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

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
                        <div className="kpi-label">{kpi.label}</div>
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
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {lossMitigation.programDistribution.map((entry, index) => (
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
                            <LineChart data={lossMitigation.volumeTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="requests" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }}>
                                    <LabelList dataKey="requests" position="top" style={{ fontSize: '10px', fill: 'var(--text-main)', fontWeight: 600 }} />
                                </Line>
                                <Line type="monotone" dataKey="completed" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }}>
                                    <LabelList dataKey="completed" position="bottom" style={{ fontSize: '10px', fill: 'var(--text-main)', fontWeight: 600 }} />
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Status Breakdown (Stacked Bar) - Full Width */}
                <div className="card chart-card span-12">
                    <div className="chart-header">
                        <h3 className="chart-title">Customer Status Breakdown</h3>
                    </div>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={lossMitigation.statusBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="stage" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="doc" name="Documentation" fill="var(--primary)" stackId="a" radius={[0, 0, 0, 0]} >
                                    <LabelList dataKey="doc" position="center" style={{ fill: 'white', fontSize: '10px', fontWeight: 600 }} />
                                </Bar>
                                <Bar dataKey="review" name="Under Review" fill="var(--accent)" stackId="a" radius={[0, 0, 0, 0]}>
                                    <LabelList dataKey="review" position="center" style={{ fill: 'white', fontSize: '10px', fontWeight: 600 }} />
                                </Bar>
                                <Bar dataKey="final" name="Final Decision" fill="var(--warning)" stackId="a" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="final" position="top" style={{ fill: 'var(--text-main)', fontSize: '10px', fontWeight: 600 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Assistance Duration Distribution (Histogram) - Full Width */}
                <div className="card chart-card span-12">
                    <div className="chart-header">
                        <h3 className="chart-title">Assistance Duration Distribution</h3>
                    </div>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={lossMitigation.durationDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
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
