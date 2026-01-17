import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ScatterChart, Scatter, ZAxis,
    LineChart, Line, Legend, Cell,
    LabelList
} from 'recharts';
import { Map, Target, TrendingUp, AlertTriangle, Shield, Filter, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ label, value, trend, up }) => (
    <div className="card">
        <div className="kpi-label">{label}</div>
        <div className="kpi-value">{value}</div>
        <div className={`kpi-trend ${up === null ? '' : up ? 'trend-up' : 'trend-down'}`}>
            {up === true && <ArrowUpRight size={12} />}
            {up === false && <ArrowDownRight size={12} />}
            <span>{trend}</span>
        </div>
    </div>
);

const SectionHeader = ({ title, icon: Icon }) => (
    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {Icon && <Icon size={20} className="text-primary" />}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
    </div>
);

const HeatmapCell = ({ value }) => {
    const getBG = (v) => {
        if (v > 15) return 'rgba(239, 68, 68, 0.8)';
        if (v > 10) return 'rgba(245, 158, 11, 0.8)';
        if (v > 5) return 'rgba(59, 130, 246, 0.6)';
        return 'rgba(16, 185, 129, 0.4)';
    };
    return (
        <div style={{
            background: getBG(value),
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            borderRadius: '4px',
            margin: '2px'
        }}>
            {value}%
        </div>
    );
};

const RiskSegmentation = ({ data }) => {
    const [filterRegion, setFilterRegion] = useState('All');

    if (!data || !data.segmentation) return null;
    const { kpis, geoDelinquency, scoreVsDelinquency, loanAgeVsRisk, vintageHeatmap, segmentContribution } = data.segmentation;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div style={{ padding: '0 1rem', animation: 'fadeIn 0.5s ease-out' }}>
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Risk Segmentation Analysis</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Deep dive into portfolio risk pockets across regions, scores, and vintage cohorts.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <Filter size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Region:</span>
                    <select
                        value={filterRegion}
                        onChange={(e) => setFilterRegion(e.target.value)}
                        style={{ border: 'none', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}
                    >
                        <option>All</option>
                        <option>North</option>
                        <option>South</option>
                        <option>East</option>
                        <option>West</option>
                    </select>
                </div>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {kpis.map((kpi, i) => (
                    <KPICard key={i} {...kpi} />
                ))}
            </div>

            <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="chart-card span-6">
                    <SectionHeader title="Geographic Delinquency Distribution" icon={Map} />
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={geoDelinquency}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} unit="%" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`${value}%`, 'Delinquency Rate']}
                                />
                                <Bar dataKey="delinquencyRate" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                                    {geoDelinquency.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.delinquencyRate > 10 ? '#ef4444' : 'var(--primary)'} />
                                    ))}
                                    <LabelList dataKey="delinquencyRate" position="top" formatter={(v) => `${v}%`} style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card span-6">
                    <SectionHeader title="Regional Risk Composition" />
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={segmentContribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Legend />
                                <Bar dataKey="Low Risk" stackId="a" fill="#10b981">
                                    <LabelList dataKey="Low Risk" position="center" style={{ fill: 'white', fontSize: '10px' }} />
                                </Bar>
                                <Bar dataKey="Medium Risk" stackId="a" fill="#3b82f6">
                                    <LabelList dataKey="Medium Risk" position="center" style={{ fill: 'white', fontSize: '10px' }} />
                                </Bar>
                                <Bar dataKey="High Risk" stackId="a" fill="#ef4444">
                                    <LabelList dataKey="High Risk" position="top" style={{ fill: 'var(--text-main)', fontSize: '10px' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="chart-card">
                    <SectionHeader title="Credit Score vs. Delinquency" icon={Target} />
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis type="number" dataKey="score" name="Credit Score" unit="" domain={[500, 850]} axisLine={false} tickLine={false} />
                                <YAxis type="number" dataKey="delinquency" name="Days Delinquent" unit="d" axisLine={false} tickLine={false} />
                                <ZAxis type="number" dataKey="amount" range={[20, 400]} name="Loan Amount" unit="k" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Scatter name="Loans" data={scoreVsDelinquency} fill="#3b82f6" fillOpacity={0.6} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <SectionHeader title="Loan Age vs Risk Profile" icon={Shield} />
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={loanAgeVsRisk}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} unit="%" />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="riskRate" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }}>
                                    <LabelList dataKey="riskRate" position="top" formatter={(v) => `${v}%`} style={{ fontSize: '10px', fontWeight: 600, fill: '#8b5cf6' }} />
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="chart-card full-width">
                    <SectionHeader title="Origination Vintage Heatmap (Default %)" icon={TrendingUp} />
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Year</th>
                                    {months.map(m => (
                                        <th key={m} style={{ padding: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {vintageHeatmap.map(row => (
                                    <tr key={row.year}>
                                        <td style={{ padding: '10px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>{row.year}</td>
                                        {months.map(m => (
                                            <td key={m} style={{ padding: '0' }}>
                                                <HeatmapCell value={row[m] || 0} />
                                            </td>
                                        ))}
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

export default RiskSegmentation;
