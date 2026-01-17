import React, { useState } from 'react';
import {
    ResponsiveContainer,
    ScatterChart, Scatter,
    XAxis, YAxis, ZAxis,
    CartesianGrid, Tooltip,
    Cell,
    BarChart, Bar,
    LabelList,
    Legend,
    ReferenceLine,
    ReferenceArea
} from 'recharts';
import {
    ArrowUpRight, ArrowDownRight,
    AlertTriangle, Bell,
    Clock, RefreshCw,
    BarChart2, ShieldAlert,
    CheckCircle2, Info, AlertOctagon
} from 'lucide-react';

const CoachingInsights = ({ data }) => {
    if (!data || !data.coaching) return null;
    const { coaching } = data;
    const [showAlertsOnly, setShowAlertsOnly] = useState(false);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header + Alert Toggle */}
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Risk, Recovery & Coaching Insights</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Action-centric view for individual performance management and coaching priority.</p>
                </div>
                <button
                    onClick={() => setShowAlertsOnly(!showAlertsOnly)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.2rem',
                        background: showAlertsOnly ? 'var(--danger)' : 'white',
                        border: '1px solid ' + (showAlertsOnly ? 'var(--danger)' : 'var(--border)'),
                        borderRadius: '10px',
                        color: showAlertsOnly ? 'white' : 'var(--text-main)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >
                    <Bell size={18} fill={showAlertsOnly ? 'white' : 'transparent'} />
                    <span>{showAlertsOnly ? 'Showing At-Risk Only' : 'Show All Associates'}</span>
                </button>
            </div>

            {/* KPI Row - 7 items as requested */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {coaching.kpis.slice(0, 7).map((kpi, i) => (
                    <div className="card" key={i} style={{ padding: '1rem' }}>
                        <div className="kpi-label" style={{ fontSize: '0.7rem' }}>{kpi.label}</div>
                        <div className="kpi-value" style={{ fontSize: '1.1rem' }}>{kpi.value}</div>
                        <div className={`kpi-trend ${kpi.up === null ? '' : kpi.up ? 'trend-up' : 'trend-down'}`} style={{ fontSize: '0.7rem' }}>
                            {kpi.up === true && <ArrowUpRight size={10} />}
                            {kpi.up === false && <ArrowDownRight size={10} />}
                            <span>{kpi.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Row 2: 4 + 4 + 4 */}
            <div className="charts-grid">
                {/* Delinquency Funnel */}
                <div className="card chart-card span-4">
                    <div className="chart-header">
                        <h3 className="chart-title">Delinquency Funnel</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accounts by Aging Stage</span>
                    </div>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={coaching.stageFunnel}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="stage" axisLine={false} tickLine={false} fontSize={10} />
                                <YAxis hide />
                                <Tooltip />
                                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30}>
                                    <LabelList dataKey="count" position="top" style={{ fontSize: '10px', fontWeight: 600 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Time-to-Cure Distribution */}
                <div className="card chart-card span-4">
                    <div className="chart-header">
                        <h3 className="chart-title">Time-to-Cure Distribution</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resolution Speed Frequency</span>
                    </div>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={coaching.timeToCureDist}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} fontSize={10} />
                                <YAxis hide />
                                <Tooltip />
                                <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={30}>
                                    <LabelList dataKey="count" position="top" style={{ fontSize: '10px', fontWeight: 600 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Repeat Delinquency Analysis */}
                <div className="card chart-card span-4">
                    <div className="chart-header">
                        <h3 className="chart-title">Repeat Delinquency Analysis</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recidivism by Tenure Type</span>
                    </div>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={coaching.repeatDelinquency}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="category" axisLine={false} tickLine={false} fontSize={10} />
                                <YAxis hide />
                                <Tooltip />
                                <Legend iconType="circle" />
                                <Bar dataKey="Migrated" fill="var(--danger)" radius={[4, 4, 0, 0]} barSize={20}>
                                    <LabelList dataKey="Migrated" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                                <Bar dataKey="Stable" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={20}>
                                    <LabelList dataKey="Stable" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 3: 8 + 4 */}
            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
                {/* Associate Risk Heatmap */}
                <div className="card chart-card span-8">
                    <div className="chart-header">
                        <h3 className="chart-title">Associate Risk Heatmap</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Competency & Risk Aggregated Scores</span>
                    </div>
                    <div style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={coaching.riskHeatmap} layout="vertical" margin={{ left: 20, right: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend verticalAlign="top" height={36} iconType="circle" />
                                <Bar dataKey="Speed" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} barSize={20} />
                                <Bar dataKey="Quality" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={20} />
                                <Bar dataKey="Consistency" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} barSize={20} />
                                <Bar dataKey="Compliance" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Coaching Priority Matrix */}
                <div className="card chart-card span-4">
                    <div className="chart-header">
                        <h3 className="chart-title">Priority Matrix</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Risk vs Performance</span>
                    </div>
                    <div style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 10, bottom: 0, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Risk" axisLine={false} tickLine={false} fontSize={10} domain={[0, 60]} />
                                <YAxis type="number" dataKey="y" name="Perf" axisLine={false} tickLine={false} fontSize={10} domain={[0, 100]} />
                                <ZAxis type="number" dataKey="z" range={[60, 250]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />

                                {/* Quadrant Backgrounds */}
                                <ReferenceArea x1={0} x2={30} y1={50} y2={100} fill="#dcfce7" fillOpacity={0.3} />
                                <ReferenceArea x1={30} x2={60} y1={50} y2={100} fill="#ffedd5" fillOpacity={0.3} />
                                <ReferenceArea x1={0} x2={30} y1={0} y2={50} fill="#fee2e2" fillOpacity={0.3} />
                                <ReferenceArea x1={30} x2={60} y1={0} y2={50} fill="#fecaca" fillOpacity={0.4} />

                                <ReferenceLine x={30} stroke="#94a3b8" strokeDasharray="3 3" />
                                <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="3 3" />

                                <Scatter name="Associates" data={coaching.priorityMatrix.slice(0, 15)}>
                                    {coaching.priorityMatrix.slice(0, 15).map((entry, index) => {
                                        let color = 'var(--primary)';
                                        if (entry.x > 30 && entry.y < 50) color = 'var(--danger)'; // High Risk, Low Perf
                                        else if (entry.x <= 30 && entry.y >= 50) color = 'var(--success)'; // Low Risk, High Perf
                                        else color = 'var(--accent)';
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 4: Decision Panel + Suggested Actions */}
            <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                <div className="chart-header" style={{ marginBottom: '1.25rem' }}>
                    <h3 className="chart-title">Decision Panel & Suggested Actions</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Automated coaching triggers based on performance volatility and risk signals.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    {/* Active Coaching Actions Table */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldAlert size={16} color="var(--danger)" />
                            <span>Recommended Coaching Interventions</span>
                        </h4>
                        <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Associate</th>
                                    <th style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Priority</th>
                                    <th style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Suggested Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coaching.suggestedActions.map((action, i) => (
                                    <tr key={i} style={{ borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{action.associate}</td>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: action.risk === 'Critical' ? '#fee2e2' : action.risk === 'Warning' ? '#ffedd5' : '#dcfce7',
                                                color: action.risk === 'Critical' ? '#991b1b' : action.risk === 'Warning' ? '#854d0e' : '#166534',
                                                fontSize: '0.7rem',
                                                fontWeight: 700
                                            }}>{action.risk}</span>
                                        </td>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>{action.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Strategic Insights / Decision Support */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                        {[
                            { icon: AlertOctagon, title: 'Early Warning Transition', text: '90% of South team risk is concentrated in the Early stage funnel. Shift focus to Current -> 30 buckets.', color: 'var(--danger)' },
                            { icon: CheckCircle2, title: 'Efficiency Milestone', text: 'West region has achieved a record "Time-to-Cure" of 38 days due to recent automation.', color: 'var(--success)' },
                            { icon: Info, title: 'Capacity Alert', text: 'Active workload is approaching "Efficiency Frontier" (400+ accounts) for 4 associates.', color: 'var(--accent)' }
                        ].map((insight, i) => (
                            <div key={i} style={{
                                padding: '1rem',
                                background: 'white',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{ color: insight.color, background: insight.color + '10', padding: '0.5rem', borderRadius: '8px' }}>
                                    <insight.icon size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{insight.title}</div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{insight.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachingInsights;
