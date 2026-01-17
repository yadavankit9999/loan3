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

            {/* Row 1: 6 + 6 */}
            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
                <div className="card chart-card span-6">
                    <div className="chart-header">
                        <h3 className="chart-title">Migration Volume Trend</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Reassignment Volume</span>
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
                    <div className="chart-header">
                        <h3 className="chart-title">Migrated vs Non-Migrated</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Distribution Comparison</span>
                    </div>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={diagnostics.groupedComparison} margin={{ top: 10, right: CHART_CONFIG.marginRight, left: CHART_CONFIG.marginLeft, bottom: CHART_CONFIG.marginBottom }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="status" axisLine={false} tickLine={false} fontSize={12} label={{ value: 'Delinquency Status', ...CHART_CONFIG.xLabel }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={CHART_CONFIG.yAxisWidth} hide />
                                <Tooltip formatter={(val) => `${val} Cases`} />
                                <Legend iconType="circle" verticalAlign="top" align="right" />
                                <Bar dataKey="Migrated" name="Migrated Portfolio" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="Migrated" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                                <Bar dataKey="Non-Migrated" name="Stable Portfolio" fill="var(--secondary)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="Non-Migrated" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 2: 4 + 4 + 4 */}
            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
                <div className="card chart-card span-4">
                    <div className="chart-header">
                        <h3 className="chart-title">Migration Outcome Breakdown</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Post-Migration Results</span>
                    </div>
                    <div style={{ height: 240 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={diagnostics.outcomeBreakdown}
                                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" fontSize={10} axisLine={false} tickLine={false} label={{ value: 'Account Volume', ...CHART_CONFIG.xLabel, offset: -5 }} />
                                <YAxis
                                    dataKey="outcome"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={10}
                                    width={100}
                                />
                                <Tooltip />
                                <Bar dataKey="value" name="Account Volume" radius={[0, 4, 4, 0]} barSize={30}>
                                    {diagnostics.outcomeBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                    <LabelList dataKey="value" position="right" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card span-4">
                    <div className="chart-header" style={{ marginBottom: '0.75rem' }}>
                        <h3 className="chart-title">Workload vs Delinquency</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Staff Efficiency Frontier</span>
                    </div>

                    {/* Custom High-Visibility Legend */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', padding: '0 1rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: '#6366f1' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} /> Normal
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: '#ef4444' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> High Risk (&gt;10%)
                        </div>
                    </div>

                    <div style={{ height: 220 }}>
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

                <div className="card chart-card span-4">
                    <div className="chart-header" style={{ marginBottom: '0.75rem' }}>
                        <h3 className="chart-title">Stabilization Matrix</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Days since Migration vs Risk</span>
                    </div>

                    {/* Custom High-Visibility Legend */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', padding: '0 1rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: '#10b981' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> &lt; 90D
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: '#ef4444' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> &gt; 90D
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #94a3b8' }} /> Bubble Size: Balance
                        </div>
                    </div>

                    <div style={{ height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: CHART_CONFIG.marginRight, bottom: CHART_CONFIG.marginBottom + 10, left: CHART_CONFIG.marginLeft }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Days Migrated" tickLine={false} fontSize={10} label={{ value: 'Days Since Migration', ...CHART_CONFIG.xLabel, position: 'bottom', offset: 0 }} />
                                <YAxis type="number" dataKey="y" name="Delinquency Days" tickLine={false} fontSize={10} width={CHART_CONFIG.yAxisWidth} label={{ value: 'Delinquency Days', ...CHART_CONFIG.yLabel }} />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Account Balance" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter data={diagnostics.stabilizationMatrix} legendType="none">
                                    {diagnostics.stabilizationMatrix.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.y > 90 ? '#ef4444' : '#10b981'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom: Account Deterioration Flow (Sankey Substitute) */}
            <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                <div className="chart-header" style={{ marginBottom: '2rem' }}>
                    <h3 className="chart-title">Account Deterioration Flow</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Visualizing the migration of accounts from Current to Delinquent statuses.</p>
                </div>

                <div className="flow-container" style={{ position: 'relative', width: '100%', padding: '0 2rem' }}>
                    {/* Flow Steps */}
                    {[
                        { label: 'Current', color: 'var(--success)', value: '450' },
                        { label: '30-60 Days', color: 'var(--warning)', value: '180' },
                        { label: '60-90 Days', color: 'var(--danger)', value: '85' },
                        { label: '90+ Days', color: '#991b1b', value: '42' },
                        { label: 'Legal/Loss', color: '#450a0a', value: '15' }
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
                                    height: '8px',
                                    background: `linear-gradient(to right, ${step.color}, ${arr[i + 1].color})`,
                                    opacity: 0.3,
                                    borderRadius: '4px',
                                    margin: '0 -5px',
                                    marginTop: '-25px',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        right: '0',
                                        top: '50%',
                                        transform: 'translateY(-50%) rotate(-45deg)',
                                        width: '10px',
                                        height: '10px',
                                        borderRight: `3px solid ${arr[i + 1].color}`,
                                        borderBottom: `3px solid ${arr[i + 1].color}`
                                    }}></div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OperationalDiagnostics;
