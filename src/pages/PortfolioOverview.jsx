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

const PortfolioOverview = ({ data }) => {
    const { kpis, raw } = data;

    // Process data for charts
    const associateStats = useMemo(() => {
        if (!raw) return [];

        return raw.associates.map(assoc => {
            const assocAccounts = raw.accounts.filter(a => a.associate_id === assoc.associate_id);
            const total = assocAccounts.length;
            const delinquent = assocAccounts.filter(a => a.days_delinquent > 0).length;
            const cured = assocAccounts.filter(a => a.cured_flag === 1).length;

            return {
                name: assoc.associate_name,
                accounts: total,
                delinquencyRate: total > 0 ? ((delinquent / total) * 100).toFixed(1) : 0,
                cureRate: total > 0 ? ((cured / total) * 100).toFixed(1) : 0,
                region: assoc.region
            };
        }).sort((a, b) => b.delinquencyRate - a.delinquencyRate).slice(0, 10);
    }, [raw]);

    const trendData = [
        { month: 'Jan', delinquency: 12, cures: 8 },
        { month: 'Feb', delinquency: 14, cures: 10 },
        { month: 'Mar', delinquency: 13, cures: 11 },
        { month: 'Apr', delinquency: 15, cures: 13 },
        { month: 'May', delinquency: 11, cures: 14 },
        { month: 'Jun', delinquency: 10, cures: 15 },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header with Selector */}
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-0.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Portfolio Overview</h2>
                    <p style={{ color: 'var(--text-muted)' }}>High-level executive summary of portfolio health and key performance metrics.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Reporting Period:</span>
                    <select style={{ border: 'none', outline: 'none', fontWeight: 700, background: 'transparent', cursor: 'pointer' }}>
                        <option>Last 30 Days</option>
                        <option>Q4 2025</option>
                        <option>Q3 2025</option>
                        <option>Full Year 2025</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                {kpis.map((kpi, i) => (
                    <div key={i} className="card">
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

            {/* Row 1: 6 + 6 column layout */}
            <div className="charts-grid">
                <div className="card chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Associate Delinquency Comparison</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Comparative Risk</span>
                    </div>
                    <div style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={associateStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} interval={0} angle={-25} textAnchor="end" height={60} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="delinquencyRate" name="Delinquency %" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30}>
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
                    <div style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[...associateStats].sort((a, b) => b.cureRate - a.cureRate)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} interval={0} angle={-25} textAnchor="end" height={60} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="cureRate" name="Cure Rate %" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={25}>
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
                    <div style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorDelinq" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} dy={10} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
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
                            <BarChart data={associateStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} interval={0} angle={-25} textAnchor="end" height={60} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="accounts" name="Active Accounts" fill="var(--secondary)" radius={[4, 4, 0, 0]}>
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
