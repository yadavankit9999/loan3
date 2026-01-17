import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, ComposedChart, Line, FunnelChart, Funnel, LabelList
} from 'recharts';
import {
    TrendingUp, Activity, AlertCircle, Zap, ShieldAlert, ArrowRight,
    ChevronRight, Info, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { CHART_CONFIG } from '../chartConfig';

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

const SectionHeader = ({ title, icon: Icon, rightElement }) => (
    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {Icon && <Icon size={20} className="text-primary" />}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
        </div>
        {rightElement}
    </div>
);

const RiskTransitionMatrix = ({ data }) => {
    const buckets = ['Current', '30-60', '60-90', '90+'];

    const getValue = (from, to) => {
        const item = data.find(d => d.from === from && d.to === to);
        return item ? item.value : 0;
    };

    const getBG = (v, from, to) => {
        if (v === 0) return 'transparent';
        const buckets = ['Current', '30-60', '60-90', '90+'];
        const fromIdx = buckets.indexOf(from);
        const toIdx = buckets.indexOf(to);

        if (toIdx < fromIdx) return `rgba(16, 185, 129, ${v / 100})`; // Recovery (Green)
        if (toIdx > fromIdx) return `rgba(239, 68, 68, ${v / 100})`; // Deterioration (Red)
        return `rgba(99, 102, 241, ${v / 100})`; // Stability (Indigo)
    };

    const getColor = (v, from, to) => {
        if (v > 50) return '#ffffff'; // High contrast for dark backgrounds
        const buckets = ['Current', '30-60', '60-90', '90+'];
        const fromIdx = buckets.indexOf(from);
        const toIdx = buckets.indexOf(to);

        if (toIdx < fromIdx) return '#10b981';
        if (toIdx > fromIdx) return '#ef4444';
        return '#6366f1';
    };

    return (
        <div style={{ padding: '10px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${buckets.length}, 1fr)`, gap: '4px', minWidth: '400px' }}>
                <div />
                {buckets.map(b => (
                    <div key={b} style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '8px' }}>To: {b}</div>
                ))}
                {buckets.map(from => (
                    <React.Fragment key={from}>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, paddingRight: '12px' }}>From: {from}</div>
                        {buckets.map(to => {
                            const val = getValue(from, to);
                            return (
                                <div key={`${from}-${to}`} style={{
                                    background: getBG(val, from, to),
                                    height: '50px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: val > 0 ? `1px solid ${getColor(val, from, to)}33` : '1px dashed var(--border)'
                                }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: getColor(val, from, to) }}>{val > 0 ? `${val}%` : '-'}</span>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const DecisionInsightCard = ({ item }) => {
    const isCritical = item.type === 'critical';
    const isWarning = item.type === 'warning';

    return (
        <div style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: isCritical ? 'rgba(239, 68, 68, 0.03)' : isWarning ? 'rgba(245, 158, 11, 0.03)' : 'rgba(59, 130, 246, 0.03)',
            borderLeft: `4px solid ${isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#3b82f6'}`,
            marginBottom: '1rem',
            display: 'flex',
            gap: '1rem'
        }}>
            <div style={{ color: isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#3b82f6' }}>
                {isCritical ? <ShieldAlert size={20} /> : isWarning ? <AlertTriangle size={20} /> : <Info size={20} />}
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#3b82f6' }}>
                        {item.type} Priority
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Impact: {item.impact}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>{item.message}</p>
                <button style={{
                    marginTop: '0.75rem',
                    background: 'none',
                    border: 'none',
                    color: isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#3b82f6',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer',
                    padding: 0
                }}>
                    VIEW MITIGATION PLAN <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};

const RiskForecasting = ({ data }) => {
    const [forecastRange, setForecastRange] = useState('90 Days');

    if (!data || !data.forecasting) return null;
    const { kpis, delinquencyForecast, transitionMatrix, earlyWarningSignals, riskFunnelData, riskScoreBuckets, decisionInsights } = data.forecasting;

    return (
        <div style={{ padding: '0 1rem', animation: 'fadeIn 0.5s ease-out' }}>
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Risk Forecasting & Transition</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Forward-looking analytics (ECL, rolling warnings) and status transition probability matrices.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <Activity size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Forecast Range:</span>
                    <select
                        value={forecastRange}
                        onChange={(e) => setForecastRange(e.target.value)}
                        style={{ border: 'none', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}
                    >
                        <option>30 Days</option>
                        <option>60 Days</option>
                        <option>90 Days</option>
                        <option>180 Days</option>
                    </select>
                </div>
            </div>

            <div className="kpi-grid">
                {kpis.map((kpi, i) => (
                    <KPICard key={i} {...kpi} />
                ))}
            </div>

            <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="chart-card full-width">
                    <SectionHeader title="Delinquency Forecast (Monte Carlo Projection)" icon={TrendingUp} rightElement={
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '2px', background: 'var(--primary)' }} /> Historical
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '2px', background: 'white', border: '2px solid #f97316' }} /> Projected
                            </div>
                        </div>
                    } />
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                data={delinquencyForecast.map((d, i, arr) => ({
                                    ...d,
                                    hRate: d.type === 'Historical' ? d.rate : null,
                                    pRate: d.type === 'Projected' || (d.type === 'Historical' && arr[i + 1]?.type === 'Projected') ? d.rate : null
                                }))}
                                margin={{ top: 20, right: CHART_CONFIG.marginRight, bottom: CHART_CONFIG.marginBottom, left: CHART_CONFIG.marginLeft }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} label={{ value: 'Timeline', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} width={CHART_CONFIG.yAxisWidth} unit="%" label={{ value: 'Expected Delinquency (%)', ...CHART_CONFIG.yLabel }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="none"
                                    fill="url(#colorRate)"
                                    activeDot={false}
                                />
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Line
                                    type="monotone"
                                    dataKey="hRate"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: 'var(--primary)' }}
                                >
                                    <LabelList dataKey="hRate" position="top" formatter={(v) => v ? `${v}%` : ''} style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Line>
                                <Line
                                    type="monotone"
                                    dataKey="pRate"
                                    stroke="#f97316"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                    dot={{ r: 4, fill: 'white', stroke: '#f97316', strokeWidth: 2 }}
                                >
                                    <LabelList dataKey="pRate" position="top" formatter={(v) => v ? `${v}%` : ''} style={{ fontSize: '10px', fontWeight: 600, fill: '#f97316' }} />
                                </Line>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="chart-card">
                    <SectionHeader title="Risk Transition Matrix (Probabilities)" icon={Zap} />
                    <RiskTransitionMatrix data={transitionMatrix} />
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: 12, height: 12, borderRadius: '2px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid #6366f1' }} /> Stability
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: 12, height: 12, borderRadius: '2px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }} /> Deterioration
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: 12, height: 12, borderRadius: '2px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' }} /> Recovery
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chart-card">
                    <SectionHeader title="Early Warning Signals" icon={Zap} />
                    <div style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={earlyWarningSignals} layout="vertical" margin={{ left: CHART_CONFIG.marginLeft, right: CHART_CONFIG.marginRight, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                                <XAxis type="number" fontSize={10} label={{ value: 'Signal Count', ...CHART_CONFIG.xLabel }} />
                                <YAxis dataKey="signal" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-main)', fontWeight: 600 }} width={120} label={{ value: 'Risk Indicator', ...CHART_CONFIG.yLabel }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {earlyWarningSignals.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.impact === 'Critical' ? '#ef4444' : entry.impact === 'High' ? '#f59e0b' : '#3b82f6'} />
                                    ))}
                                    <LabelList dataKey="count" position="right" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="chart-card span-4">
                    <SectionHeader title="Risk Funnel" icon={ArrowRight} />
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <FunnelChart>
                                <Tooltip />
                                <Funnel
                                    data={riskFunnelData}
                                    dataKey="value"
                                >
                                    <LabelList position="right" fill="var(--text-muted)" stroke="none" dataKey="label" fontSize={10} />
                                    <Legend verticalAlign="top" align="right" payload={[{ value: 'Filter', type: 'rect', color: '#3b82f6' }, { value: 'Early Alert', type: 'rect', color: '#8b5cf6' }, { value: 'Warning', type: 'rect', color: '#f59e0b' }, { value: 'Serious', type: 'rect', color: '#ef4444' }]} />
                                    {riskFunnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][index]} />
                                    ))}
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card span-8">
                    <SectionHeader title="Loan Risk Score Distribution" icon={ShieldAlert} />
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskScoreBuckets} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} label={{ value: 'Risk Score Range', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Loan Count', ...CHART_CONFIG.yLabel }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                                    {riskScoreBuckets.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Critical' ? '#ef4444' : entry.name === 'High' ? '#f59e0b' : 'var(--primary)'} />
                                    ))}
                                    <LabelList dataKey="count" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card full-width" style={{ background: 'white' }}>
                    <SectionHeader title="Decision Insight Panel" icon={Zap} rightElement={
                        <div style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.7rem', fontWeight: 700 }}>
                            {decisionInsights.length} NEW ALERTS
                        </div>
                    } />
                    <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '5px' }}>
                        {decisionInsights.map(item => (
                            <DecisionInsightCard key={item.id} item={item} />
                        ))}
                    </div>
                    <button style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'var(--bg-main)',
                        border: 'none',
                        borderTop: '1px solid var(--border)',
                        color: 'var(--primary)',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                    }}>
                        EXPORT ALL RECOMMENDATIONS
                    </button>
                </div>
            </div>
        </div >
    );
};

export default RiskForecasting;
