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
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
                {diagnostics.kpis.map((kpi, i) => (
                    <div className="card" key={i} style={{ padding: '1rem' }}>
                        <div className="kpi-label" style={{ fontSize: '0.7rem', marginBottom: '0.25rem' }}>{kpi.label}</div>
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
                            <BarChart data={diagnostics.volumeTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="volume" name="Accounts Migrated" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40}>
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
                            <BarChart data={diagnostics.groupedComparison}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="status" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} hide />
                                <Tooltip />
                                <Legend iconType="circle" />
                                <Bar dataKey="Migrated" fill="var(--danger)" radius={[4, 4, 0, 0]}>
                                    <LabelList dataKey="Migrated" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                                <Bar dataKey="Non-Migrated" fill="var(--accent)" radius={[4, 4, 0, 0]}>
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
                            <BarChart data={diagnostics.outcomeBreakdown} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="outcome" type="category" fontSize={10} axisLine={false} tickLine={false} width={100} />
                                <Tooltip />
                                <Bar dataKey="value" name="Volume" radius={[0, 4, 4, 0]} barSize={20}>
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
                    <div className="chart-header">
                        <h3 className="chart-title">Workload vs Delinquency</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Finding the Efficiency Frontier</span>
                    </div>
                    <div style={{ height: 240 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Workload" tickLine={false} fontSize={10} domain={['auto', 'auto']} padding={{ left: 20, right: 20 }} />
                                <YAxis type="number" dataKey="y" name="Delinquency" unit="%" tickLine={false} fontSize={10} domain={[0, 'auto']} padding={{ top: 20 }} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Associates" data={diagnostics.scatterData} fill="var(--primary)">
                                    {diagnostics.scatterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.y > 10 ? 'var(--danger)' : 'var(--primary)'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card span-4">
                    <div className="chart-header">
                        <h3 className="chart-title">Stabilization Matrix</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Days since Migration vs Risk</span>
                    </div>
                    <div style={{ height: 240 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Days Migrated" tickLine={false} fontSize={10} />
                                <YAxis type="number" dataKey="y" name="Delinquency Days" tickLine={false} fontSize={10} />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Accounts" data={diagnostics.stabilizationMatrix} fill="var(--accent)">
                                    {diagnostics.stabilizationMatrix.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.y > 60 ? 'var(--danger)' : 'var(--accent)'} />
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', height: '120px', padding: '0 2rem' }}>
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
