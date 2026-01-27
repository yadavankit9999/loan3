import React, { useState } from 'react';
import {
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
    ScatterChart, Scatter, ZAxis,
    PieChart, Pie,
    LabelList,
    AreaChart, Area
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Filter, Users, Globe, ExternalLink } from 'lucide-react';
import { CHART_CONFIG } from '../chartConfig';

const OperationalDiagnostics = ({ data }) => {
    if (!data || !data.diagnostics) return null;
    const { diagnostics } = data;
    const [filterAssociate, setFilterAssociate] = useState('All');
    const [filterRegion, setFilterRegion] = useState('All');
    const [snapshotInterval, setSnapshotInterval] = useState('Weekly');

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header + Filters */}
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Migration, Workload & Root Cause</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Diagnostic view to isolate the impact of account reassignments and workload stress.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <Users size={16} color="var(--text-muted)" />
                        <select
                            value={filterAssociate}
                            onChange={(e) => setFilterAssociate(e.target.value)}
                            style={{ border: 'none', background: 'none', fontSize: '0.875rem', fontWeight: 500, outline: 'none', cursor: 'pointer' }}
                        >
                            <option>All Associates</option>
                            <option>John Doe</option>
                            <option>Jane Smith</option>
                        </select>
                    </div>
                    <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <Globe size={16} color="var(--text-muted)" />
                        <select
                            value={filterRegion}
                            onChange={(e) => setFilterRegion(e.target.value)}
                            style={{ border: 'none', background: 'none', fontSize: '0.875rem', fontWeight: 500, outline: 'none', cursor: 'pointer' }}
                        >
                            <option>All Regions</option>
                            <option>North</option>
                            <option>South</option>
                            <option>East</option>
                            <option>West</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Snapshot Timing:</span>
                    <select
                        value={snapshotInterval}
                        onChange={(e) => setSnapshotInterval(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontWeight: 700, background: 'transparent', cursor: 'pointer' }}
                    >
                        <option value="Monthly (16th)">Monthly (16th)</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Every 5 Days">Every 5 Days</option>
                    </select>
                </div>
            </div>

            {/* KPI Row - 7 Columns as requested */}
            <div className="kpi-grid">
                {diagnostics.kpis.map((kpi, i) => (
                    <div className="card" key={i} style={{ padding: '1rem' }}>
                        <div className="kpi-label" title={kpi.label}>{kpi.label}</div>
                        <div className="kpi-value" style={{ fontSize: '1.1rem' }}>{kpi.value}</div>
                        <div className={`kpi-trend ${kpi.up === null ? '' : kpi.up ? 'trend-up' : 'trend-down'}`} style={{ fontSize: '0.7rem' }}>
                            {kpi.up === true && <ArrowUpRight size={10} />}
                            {kpi.up === false && <ArrowDownRight size={10} />}
                            <span>{kpi.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts Grid */}
            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
                {/* Row 1: 6 + 6 */}
                <div className="card chart-card span-6">
                    <div className="chart-header">
                        <h3 className="chart-title">Migration Volume Trend</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tracking account reassignments over time (executed on the 16th)</span>
                    </div>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={diagnostics.volumeTrend} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} label={{ value: 'Timeline', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Accounts', ...CHART_CONFIG.yLabel }} />
                                <Tooltip formatter={(val) => `${val} Accounts`} />
                                <Bar dataKey="volume" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="volume" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card span-6">
                    <div className="chart-header" style={{ marginBottom: '0.75rem' }}>
                        <h3 className="chart-title">Workload vs. Delinquency</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Staff Efficiency (Accounts Managed vs. Performance)</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', padding: '0 1rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: '#6366f1' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} /> Normal
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: '#ef4444' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> High Risk (&gt;10%)
                        </div>
                    </div>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: CHART_CONFIG.marginRight, bottom: CHART_CONFIG.marginBottom + 10, left: CHART_CONFIG.marginLeft }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Workload" tickLine={false} fontSize={10} domain={['auto', 'auto']} label={{ value: 'Accounts Managed', ...CHART_CONFIG.xLabel, position: 'bottom', offset: 0 }} />
                                <YAxis type="number" dataKey="y" name="Delinquency" unit="%" tickLine={false} fontSize={10} width={CHART_CONFIG.yAxisWidth} domain={[0, 'auto']} label={{ value: 'Delinquency Rate (%)', ...CHART_CONFIG.yLabel }} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter data={diagnostics.scatterData} legendType="none">
                                    {diagnostics.scatterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.y > 10 ? '#ef4444' : '#6366f1'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Row 2: Weekly Migration Deep-Dive */}
                <div className="card chart-card span-6">
                    <div className="chart-header">
                        <h3 className="chart-title">Migrated vs Non-Migrated ({snapshotInterval})</h3>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Transitions across aging categories</span>
                    </div>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={
                                    snapshotInterval === 'Weekly' ? diagnostics.weeklyBreakdown.migration :
                                        snapshotInterval === 'Every 5 Days' ? diagnostics.weeklyBreakdown.migration.map((d, i) => ({ ...d, week: `Day ${i * 5 + 1}-${(i + 1) * 5}` })) :
                                            diagnostics.groupedComparison
                                }
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey={snapshotInterval === 'Monthly (16th)' ? 'status' : 'week'} axisLine={false} tickLine={false} fontSize={12} fontWeight={600} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={50} />
                                <Tooltip />
                                <Legend iconType="circle" verticalAlign="top" align="right" height={36} />
                                <Bar dataKey="Migrated" fill="var(--primary)" barSize={snapshotInterval === 'Monthly (16th)' ? 60 : 40} radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="Migrated" position="top" style={{ fontSize: '11px', fontWeight: 600 }} />
                                </Bar>
                                <Bar dataKey="Non-Migrated" fill="var(--secondary)" barSize={snapshotInterval === 'Monthly (16th)' ? 60 : 40} radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="Non-Migrated" position="top" style={{ fontSize: '11px', fontWeight: 600 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card span-6">
                    <div className="chart-header">
                        <h3 className="chart-title">Migration Outcome Breakdown ({snapshotInterval})</h3>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Cured, Stayed, or Deteriorated</span>
                    </div>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={
                                    snapshotInterval === 'Monthly (16th)' ?
                                        diagnostics.outcomeBreakdown.map(o => ({ key: o.outcome, [o.outcome]: o.value })) :
                                        snapshotInterval === 'Weekly' ? diagnostics.weeklyBreakdown.outcomes :
                                            diagnostics.weeklyBreakdown.outcomes.map((d, i) => ({ ...d, week: `Day ${i * 5 + 1}-${(i + 1) * 5}` }))
                                }
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey={snapshotInterval === 'Monthly (16th)' ? 'key' : 'week'} axisLine={false} tickLine={false} fontSize={12} fontWeight={600} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={50} />
                                <Tooltip />
                                <Legend iconType="circle" verticalAlign="top" align="right" height={36} />
                                {snapshotInterval === 'Monthly (16th)' ? (
                                    diagnostics.outcomeBreakdown.map((o) => (
                                        <Bar key={o.outcome} dataKey={o.outcome} fill={o.fill} radius={[4, 4, 0, 0]} barSize={80}>
                                            <LabelList dataKey={o.outcome} position="top" style={{ fontSize: '11px', fontWeight: 600 }} />
                                        </Bar>
                                    ))
                                ) : (
                                    <>
                                        <Bar dataKey="Cured" fill="var(--success)" stackId="a" barSize={60}>
                                            <LabelList dataKey="Cured" position="center" style={{ fontSize: '10px', fontWeight: 700, fill: 'white' }} />
                                        </Bar>
                                        <Bar dataKey="Stayed" fill="var(--warning)" stackId="a" barSize={60}>
                                            <LabelList dataKey="Stayed" position="center" style={{ fontSize: '10px', fontWeight: 700, fill: 'white' }} />
                                        </Bar>
                                        <Bar dataKey="Deteriorated" fill="var(--danger)" stackId="a" radius={[4, 4, 0, 0]} barSize={60}>
                                            <LabelList dataKey="Deteriorated" position="top" style={{ fontSize: '10px', fontWeight: 700 }} />
                                        </Bar>
                                    </>
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Row 4: Stabilization Matrix */}
                <div className="card chart-card span-12">
                    <div className="chart-header">
                        <h3 className="chart-title">Stabilization & Risk Matrix</h3>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Days since Migration vs. Current Delinquency Risk</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', padding: '0 1rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} /> Stabilized (&lt; 90D)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#ef4444' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} /> High Risk (&gt; 90D)
                        </div>
                    </div>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Days Migrated" tickLine={false} fontSize={11} label={{ value: 'Days Since Last Migration', position: 'bottom', offset: 20, fontSize: 12, fontWeight: 600 }} />
                                <YAxis type="number" dataKey="y" name="Delinquency Days" tickLine={false} fontSize={11} width={50} label={{ value: 'Total Delinquency Days', angle: -90, position: 'left', offset: 10, fontSize: 12, fontWeight: 600 }} />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Balance" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter data={diagnostics.stabilizationMatrix} legendType="none">
                                    {diagnostics.stabilizationMatrix.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.y > 90 ? '#ef4444' : '#10b981'} fillOpacity={0.6} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Row 5: Account Deterioration Flow */}
                <div className="card chart-card span-12" style={{ padding: '1.5rem' }}>
                    <div className="chart-header" style={{ marginBottom: '2rem' }}>
                        <div>
                            <h3 className="chart-title">Account Deterioration Flow</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Visualizing the migration of accounts from Current to Delinquent statuses.</p>
                        </div>
                    </div>

                    <div className="flow-container" style={{ position: 'relative', width: '100%', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Flow Steps */}
                        {[
                            { label: 'Total Portfolio', color: 'var(--secondary)', value: '12,500' },
                            { label: 'Current', color: 'var(--success)', value: '11,838' },
                            { label: '30-60 Days', color: 'var(--warning)', value: '352' },
                            { label: '60-90 Days', color: 'var(--danger)', value: '158' },
                            { label: '90+ Days', color: '#991b1b', value: '112' },
                            { label: 'Legal/Loss', color: '#450a0a', value: '40' }
                        ].map((step, i, arr) => (
                            <React.Fragment key={i}>
                                <div style={{ textAlign: 'center', zIndex: 2 }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '12px',
                                        background: step.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {step.value}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>{step.label}</div>
                                </div>
                                {i < arr.length - 1 && (
                                    <div style={{
                                        flex: 1,
                                        height: '6px',
                                        background: `linear-gradient(to right, ${step.color}, ${arr[i + 1].color})`,
                                        opacity: 0.3,
                                        borderRadius: '3px',
                                        margin: '0 -10px',
                                        marginTop: '-20px',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            right: '4px',
                                            top: '50%',
                                            transform: 'translateY(-50%) rotate(-45deg)',
                                            width: '8px',
                                            height: '8px',
                                            borderRight: `2px solid ${arr[i + 1].color}`,
                                            borderBottom: `2px solid ${arr[i + 1].color}`,
                                            opacity: 0.6
                                        }} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationalDiagnostics;
