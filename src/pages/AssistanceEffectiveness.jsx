import React from 'react';
import {
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
    ScatterChart, Scatter, ZAxis,
    FunnelChart, Funnel, LabelList
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Settings2 } from 'lucide-react';
import { CHART_CONFIG } from '../chartConfig';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AssistanceEffectiveness = ({ data }) => {
    if (!data || !data.effectiveness) return null;
    const { effectiveness } = data;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>

            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Assistance Effectiveness Diagnostics</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Comparative analysis of program success rates, re-default patterns, and outcome funnels.</p>
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
                    <Settings2 size={16} />
                    <span>Program Selector</span>
                </button>
            </div>

            {/* KPI Row - 7 items as per wireframe */}
            <div className="kpi-grid">
                {effectiveness.kpis.map((kpi, i) => (
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
                {/* Cure Rate by Program (Bar) - 6 columns */}
                <div className="card chart-card span-6">
                    <div className="chart-header">
                        <h3 className="chart-title">Cure Rate by Program</h3>
                    </div>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={effectiveness.cureRateByProgram} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="program" axisLine={false} tickLine={false} fontSize={12} label={{ value: 'Assistance Program', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={CHART_CONFIG.yAxisWidth} unit="%" label={{ value: 'Success Rate (%)', ...CHART_CONFIG.yLabel }} />
                                <Tooltip />
                                <Bar dataKey="rate" name="Cure Success Rate" fill="var(--accent)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="rate" position="top" formatter={(v) => `${v}%`} style={{ fontSize: '12px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Re-default Rate by Program (Bar) - 6 columns */}
                <div className="card chart-card span-6">
                    <div className="chart-header">
                        <h3 className="chart-title">Re-default Rate by Program</h3>
                    </div>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={effectiveness.reDefaultRateByProgram} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="program" axisLine={false} tickLine={false} fontSize={12} label={{ value: 'Assistance Program', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={CHART_CONFIG.yAxisWidth} unit="%" label={{ value: 'Relapse Rate (%)', ...CHART_CONFIG.yLabel }} />
                                <Tooltip />
                                <Bar dataKey="rate" name="Re-default Risk" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="rate" position="top" formatter={(v) => `${v}%`} style={{ fontSize: '12px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>

                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Assistance Outcome Funnel - 4 columns */}
                <div className="card chart-card span-4">
                    <div className="chart-header">
                        <h3 className="chart-title">Outcome Funnel</h3>
                    </div>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <FunnelChart>
                                <Tooltip />
                                <Funnel
                                    dataKey="count"
                                    data={effectiveness.outcomeFunnel}
                                    isAnimationActive
                                >
                                    <LabelList position="right" fill="#888" stroke="none" dataKey="stage" style={{ fontSize: '10px' }} />
                                    <LabelList position="center" fill="white" stroke="none" dataKey="count" style={{ fontWeight: 700 }} />
                                    {effectiveness.outcomeFunnel.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk vs Outcome (Scatter) - 4 columns */}
                <div className="card chart-card span-4">
                    <div className="chart-header" style={{ marginBottom: '0.75rem' }}>
                        <h3 className="chart-title">Risk vs Outcome</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Success Rate by Risk Tier</span>
                    </div>

                    {/* Custom High-Visibility Legend */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', padding: '0 1rem', marginBottom: '0.5rem' }}>
                    </div>

                    <div style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: CHART_CONFIG.marginRight, bottom: CHART_CONFIG.marginBottom + 10, left: CHART_CONFIG.marginLeft }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Risk Score" axisLine={false} tickLine={false} fontSize={10} label={{ value: 'Pre-Program Risk Score', ...CHART_CONFIG.xLabel, position: 'bottom', offset: 0 }} />
                                <YAxis type="number" dataKey="y" name="Success Rate" unit="%" axisLine={false} tickLine={false} fontSize={10} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Resolution Success (%)', ...CHART_CONFIG.yLabel }} />
                                <ZAxis type="number" range={[100, 200]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Program Cohorts" data={effectiveness.riskVsOutcome} fill="var(--primary)" legendType="none">
                                    {effectiveness.riskVsOutcome.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                    <LabelList dataKey="name" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Assistance Frequency (Histogram) - 4 columns */}
                <div className="card chart-card span-4">
                    <div className="chart-header">
                        <h3 className="chart-title">Assistance Frequency</h3>
                    </div>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={effectiveness.assistanceFrequency} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="frequency" axisLine={false} tickLine={false} fontSize={12} label={{ value: 'Assistance Count', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Account Volume', ...CHART_CONFIG.yLabel }} />
                                <Tooltip />
                                <Bar dataKey="count" name="Customer Frequency" fill="var(--secondary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="count" position="top" style={{ fontSize: '12px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                                <Legend verticalAlign="top" align="right" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Program Performance Heatmap - Full Width */}
                <div className="card chart-card full-width">
                    <div className="chart-header">
                        <h3 className="chart-title">Program Performance Segment Analysis (Heatmap)</h3>
                    </div>
                    <div style={{ padding: '0 1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr', gap: '1px', background: '#e2e8f0', border: '1px solid #e2e8f0' }}>
                            <div style={{ background: '#f8fafc', padding: '1rem', fontWeight: 600 }}>Program / Segment</div>
                            <div style={{ background: '#f8fafc', padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Low LTV</div>
                            <div style={{ background: '#f8fafc', padding: '1rem', fontWeight: 600, textAlign: 'center' }}>High LTV</div>

                            {['Mod', 'Deferral', 'Forbearance'].map(p => (
                                <React.Fragment key={p}>
                                    <div style={{ background: 'white', padding: '1rem', fontWeight: 500 }}>{p}</div>
                                    {['Low LTV', 'High LTV'].map(s => {
                                        const score = effectiveness.performanceHeatmap.find(h => h.program === p && h.segment === s)?.score || 0;
                                        let bg = '#dcfce7'; // green
                                        if (score < 80) bg = '#fef9c3'; // yellow
                                        if (score < 70) bg = '#fee2e2'; // red
                                        return (
                                            <div key={`${p}-${s}`} style={{
                                                background: bg,
                                                padding: '1rem',
                                                textAlign: 'center',
                                                fontWeight: 700,
                                                color: score < 70 ? '#991b1b' : score < 80 ? '#854d0e' : '#166534'
                                            }}>
                                                {score}%
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssistanceEffectiveness;
