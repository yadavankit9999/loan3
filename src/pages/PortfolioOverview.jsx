import React, { useMemo } from 'react';
import {
    BarChart, Bar,
    LineChart, Line,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart, Area,
    LabelList
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Users, FileText } from 'lucide-react';
import { CHART_CONFIG } from '../chartConfig';

const PortfolioOverview = ({ data }) => {
    if (!data || !data.portfolio) return null;
    const { kpis, raw } = data;
    const { totalVolume, totalAccounts, weightedFico, avgLtv, delinquencyRate, suspenseTotal } = data.portfolio;

    // Process data for charts
    const associateStats = useMemo(() => {
        if (!raw || !data.associatePerformance || !data.associatePerformance.performanceStats) return [];

        return data.associatePerformance.performanceStats
            .map(perf => ({
                name: perf.name,
                region: perf.region,
                accounts: perf.account_count,
                delinquencyRate: parseFloat(perf.delinq_rate),
                volume: perf.volume,
                cureRate: parseFloat(perf.cure_rate || 0)
            }))
            .sort((a, b) => b.delinquencyRate - a.delinquencyRate)
            .slice(0, 10);
    }, [raw, data.associatePerformance]);

    const trendData = useMemo(() => [
        { month: 'Jul 2025', delinquency: 12, cures: 8 },
        { month: 'Aug 2025', delinquency: 14, cures: 10 },
        { month: 'Sep 2025', delinquency: 13, cures: 11 },
        { month: 'Oct 2025', delinquency: 15, cures: 13 },
        { month: 'Nov 2025', delinquency: 11, cures: 14 },
        { month: 'Dec 2025', delinquency: 10, cures: 15 },
    ], []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="section-header">
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Portfolio Overview</h2>
                    <p style={{ color: 'var(--text-muted)' }}>High-level executive summary of portfolio health and key performance metrics.</p>
                </div>
            </div>


            {/* KPI Cards */}
            <div className="kpi-grid">
                {kpis.map((kpi, i) => (
                    <div key={i} className="card">
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

            {/* Row 1: 6 + 6 column layout */}
            <div className="charts-grid">
                <div className="card chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Associate Delinquency Comparison</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Comparative Risk</span>
                    </div>
                    <div style={{ height: 280, minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={associateStats} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} interval={0} angle={-25} textAnchor="end" height={60} label={{ value: 'Associate Name', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={10} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Delinquency (%)', ...CHART_CONFIG.yLabel }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="delinquencyRate" name="Delinquency Rate" fill="var(--danger)" radius={[4, 4, 0, 0]} barSize={30}>
                                    <LabelList dataKey="delinquencyRate" position="top" style={{ fontSize: '10px', fill: 'var(--text-muted)', fontWeight: 600 }} formatter={(val) => `${val}%`} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Associate Cure Rate</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recovery Performance</span>
                    </div>
                    <div style={{ height: 280, minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[...associateStats].sort((a, b) => b.cureRate - a.cureRate)} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} interval={0} angle={-25} textAnchor="end" height={60} label={{ value: 'Associate Name', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={10} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Cure Rate (%)', ...CHART_CONFIG.yLabel }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="cureRate" name="Recovery Progress" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={25}>
                                    <LabelList dataKey="cureRate" position="top" style={{ fontSize: '10px', fill: 'var(--text-muted)', fontWeight: 600 }} formatter={(val) => `${val}%`} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 2: 6 + 6 column layout */}
            <div className="charts-grid">
                <div className="card chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Delinquency vs Cures Trend</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Efficiency Trend</span>
                    </div>
                    <div style={{ height: 280, minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom + 20 }}>
                                <defs>
                                    <linearGradient id="colorDelinq" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={10}
                                    tick={{ dy: 5 }}
                                    label={{ value: 'Timeline', ...CHART_CONFIG.xLabel, offset: -5 }}
                                />
                                <YAxis axisLine={false} tickLine={false} fontSize={10} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Volume', ...CHART_CONFIG.yLabel }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="delinquency" name="Delinquencies" stroke="var(--danger)" fillOpacity={1} fill="url(#colorDelinq)" strokeWidth={2}>
                                    <LabelList dataKey="delinquency" position="top" style={{ fontSize: '10px', fill: 'var(--danger)', fontWeight: 600 }} />
                                </Area>
                                <Area type="monotone" dataKey="cures" name="Cures" stroke="var(--accent)" fill="none" strokeWidth={2} strokeDasharray="5 5">
                                    <LabelList dataKey="cures" position="bottom" style={{ fontSize: '10px', fill: 'var(--accent)', fontWeight: 600 }} />
                                </Area>
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Accounts per Associate</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Workload Distribution</span>
                    </div>
                    <div style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={associateStats} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} interval={0} angle={-25} textAnchor="end" height={60} label={{ value: 'Associate Name', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Accounts', ...CHART_CONFIG.yLabel }} />
                                <Tooltip />
                                <Bar dataKey="accounts" name="Total Account Distribution" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="accounts" position="top" style={{ fontSize: '10px', fill: 'var(--text-muted)', fontWeight: 600 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className="card">
                <div className="chart-header">
                    <h3 className="chart-title">Associate Performance Leaderboard</h3>
                    <button style={{
                        fontSize: '0.75rem',
                        background: 'var(--bg-main)',
                        border: '1px solid var(--border)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}>
                        <TrendingUp size={14} /> View All Insights
                    </button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Associate Name</th>
                                <th>Region</th>
                                <th>Active Accounts</th>
                                <th>Delinquency %</th>
                                <th>Cure Rate %</th>
                                <th>Performance Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {associateStats.map((item, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                                    <td>{item.region}</td>
                                    <td>{item.accounts}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ flex: 1, background: '#f1f5f9', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{ width: `${item.delinquencyRate}%`, background: parseFloat(item.delinquencyRate) > 15 ? 'var(--danger)' : 'var(--primary)', height: '100%' }} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem' }}>{item.delinquencyRate}%</span>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{item.cureRate}%</td>
                                    <td>
                                        <span className={`badge ${parseFloat(item.delinquencyRate) > 15 ? 'badge-danger' : parseFloat(item.cureRate) > 30 ? 'badge-success' : 'badge-warning'}`}>
                                            {parseFloat(item.delinquencyRate) > 15 ? 'Critical' : parseFloat(item.cureRate) > 30 ? 'Elite' : 'Stable'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PortfolioOverview;
