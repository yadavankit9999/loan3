import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, Cell, ScatterChart, Scatter, ZAxis, LabelList, ReferenceLine
} from 'recharts';
import {
    ArrowUpRight, ArrowDownRight, Settings2, Sliders, ShieldCheck,
    Target, Zap, Activity, Filter, Info, ChevronDown
} from 'lucide-react';
import { CHART_CONFIG } from '../chartConfig';

const AssistanceStrategy = ({ data }) => {
    const [policyMode, setPolicyMode] = useState('Balanced');
    const [stressLevel, setStressLevel] = useState(50);

    if (!data || !data.strategy) return null;
    const { strategy } = data;

    const simulatedStressData = strategy.stressTestData.map(d => ({
        ...d,
        coverage: Math.min(100, Math.max(0, d.coverage + (stressLevel - 50) * 0.4)),
        impact: Math.min(100, Math.max(0, d.impact + (stressLevel - 50) * 0.8))
    }));

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Assistance Strategy & Policy Simulation</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Evaluate policy impact and simulate "What-If" scenarios for portfolio assistance.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <Settings2 size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Policy Mode:</span>
                    <select
                        value={policyMode}
                        onChange={(e) => setPolicyMode(e.target.value)}
                        style={{ border: 'none', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}
                    >
                        <option>Conservative</option>
                        <option>Balanced</option>
                        <option>Aggressive</option>
                    </select>
                </div>
            </div>



            {/* KPI Grid */}
            <div className="kpi-grid">
                {strategy.kpis.map((kpi, i) => (
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

            <div className="charts-grid">
                {/* Assistance Usage vs Outcome (Line) */}
                <div className="card chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Assistance Usage vs Outcome</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Historical Performance</span>
                    </div>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={strategy.usageOutcomeTrend} margin={{ top: 20, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} label={{ value: 'Timeline', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Performance Scaler', ...CHART_CONFIG.yLabel }} />
                                <Tooltip />
                                <Legend verticalAlign="top" align="right" />
                                <Line type="monotone" dataKey="usage" name="Program Usage" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }}>
                                    <LabelList dataKey="usage" position="top" style={{ fontSize: '10px', fontWeight: 600 }} />
                                </Line>
                                <Line type="monotone" dataKey="outcome" name="Positive Outcome" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }}>
                                    <LabelList dataKey="outcome" position="bottom" style={{ fontSize: '10px', fontWeight: 600 }} />
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Limit Stress Test (What-If Chart) */}
                <div className="card chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Limit Stress Test (What-If)</h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Impact of Eligibility Expansion</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>SENSITIVITY</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)' }}>{stressLevel}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={stressLevel}
                                    onChange={(e) => setStressLevel(parseInt(e.target.value))}
                                    style={{ width: '100px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={simulatedStressData} margin={{ top: 20, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="scenario" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} label={{ value: 'Stress Scenarios', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Impact Percentage', ...CHART_CONFIG.yLabel }} />
                                <Tooltip />
                                <Legend verticalAlign="top" align="right" />
                                <Bar dataKey="coverage" name="Portfolio Coverage" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="coverage" position="top" formatter={(v) => `${v}%`} style={{ fontSize: '10px', fontWeight: 600 }} />
                                </Bar>
                                <Bar dataKey="impact" name="Risk Impact" fill="var(--danger)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="impact" position="top" formatter={(v) => `${v}%`} style={{ fontSize: '10px', fontWeight: 600 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Flow Diagram (Simplified Sankey/List) */}
                <div className="card chart-card full-width">
                    <div className="chart-header">
                        <h3 className="chart-title">Policy Journey Flow</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer Conversion Funnel</span>
                    </div>
                    <div className="flow-container" style={{ padding: '1rem 2rem' }}>
                        {strategy.customerFlow.map((step, i) => (
                            <React.Fragment key={i}>
                                <div style={{
                                    flex: 1,
                                    background: '#f8fafc',
                                    padding: '1.5rem',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>{step.from}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{step.value.toLocaleString()}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 700, marginTop: '0.25rem' }}>
                                        {i > 0 ? `${((step.value / strategy.customerFlow[i - 1].value) * 100).toFixed(1)}% Conversion` : 'Baseline'}
                                    </div>
                                </div>
                                {i < strategy.customerFlow.length - 1 && (
                                    <ChevronDown size={24} style={{ transform: 'rotate(-90deg)', color: 'var(--border)' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Policy Matrix (Quadrant Chart) */}
                <div className="card chart-card">
                    <div className="chart-header" style={{ marginBottom: '0.75rem' }}>
                        <h3 className="chart-title">Policy Value vs Risk Matrix</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quadrant Analysis: Benefit Index vs Portfolio Risk</span>
                    </div>

                    {/* Custom High-Visibility Legend */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', padding: '0 1rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: '#10b981' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Optimal
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: '#ef4444' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> High Risk
                        </div>
                        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: '#6366f1' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} /> Standard
                        </div> */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #94a3b8' }} /> Bubble Size: Adoption
                        </div>
                    </div>

                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: CHART_CONFIG.marginRight + 10, bottom: CHART_CONFIG.marginBottom + 10, left: CHART_CONFIG.marginLeft }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Risk Level" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} label={{ value: 'Portfolio Risk Score', ...CHART_CONFIG.xLabel, position: 'bottom', offset: 0 }} />
                                <YAxis type="number" dataKey="y" name="Benefit Score" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Policy Benefit Index', ...CHART_CONFIG.yLabel }} />
                                <ZAxis type="number" dataKey="z" range={[100, 800]} name="Adoption" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <ReferenceLine x={50} stroke="var(--border)" strokeDasharray="5 5" />
                                <ReferenceLine y={50} stroke="var(--border)" strokeDasharray="5 5" />
                                <Scatter name="Policies" data={strategy.policyMatrix} legendType="none">
                                    {strategy.policyMatrix.map((entry, index) => {
                                        let color = '#6366f1'; // Standard
                                        if (entry.y > 50 && entry.x < 50) color = '#10b981'; // Optimal
                                        else if (entry.x > 50) color = '#ef4444'; // High Risk
                                        return <Cell key={`cell-${index}`} fill={color} fillOpacity={0.7} />;
                                    })}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Program ROI Analysis (Bar) */}
                <div className="card chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Program ROI Analysis</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cost vs. Simulated Return</span>
                    </div>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={strategy.roiAnalysis} margin={{ top: 20, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="program" axisLine={false} tickLine={false} fontSize={12} label={{ value: 'Strategy Program', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Monetary Value', ...CHART_CONFIG.yLabel }} />
                                <Tooltip />
                                <Legend verticalAlign="top" align="right" />
                                <Bar dataKey="cost" name="Implementation Cost" fill="var(--secondary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="cost" position="top" formatter={(v) => `$${v}`} style={{ fontSize: '10px', fontWeight: 600 }} />
                                </Bar>
                                <Bar dataKey="return" name="Est. Recovery" fill="var(--accent)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="return" position="top" formatter={(v) => `$${v}`} style={{ fontSize: '10px', fontWeight: 600 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Policy Recommendation Table */}
                <div className="card chart-card full-width">
                    <div className="chart-header">
                        <h3 className="chart-title">Strategy Recommendations</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI-Assisted Policy Actions</span>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Policy Measure</th>
                                    <th>Impact Level</th>
                                    <th>Feasibility</th>
                                    <th>Recommended Action</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {strategy.recommendations.map((rec) => (
                                    <tr key={rec.id}>
                                        <td style={{ fontWeight: 600 }}>{rec.policy}</td>
                                        <td>
                                            <span className={`badge ${rec.impact === 'Critical' ? 'badge-danger' : rec.impact === 'High' ? 'badge-warning' : 'badge-success'}`}>
                                                {rec.impact}
                                            </span>
                                        </td>
                                        <td>{rec.feasibility}</td>
                                        <td>{rec.action}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}></div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Ready</span>
                                            </div>
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

export default AssistanceStrategy;
