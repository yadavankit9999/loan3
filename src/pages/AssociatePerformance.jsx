import React, { useState, useMemo } from 'react';
import {
    BarChart, Bar,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer,
    Legend, LabelList
} from 'recharts';
import { Users, Filter, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { CHART_CONFIG } from '../chartConfig';

const AssociatePerformance = ({ data }) => {
    if (!data || !data.associatePerformance) return null;

    const { associatePerformance } = data;
    const { performanceData, collectors } = associatePerformance;

    // States for single associate snapshot (Chart A)
    const [selectedAssociate, setSelectedAssociate] = useState(collectors[0]);

    // States for multi-associate comparison (Chart B)
    const [selectedComparison, setSelectedComparison] = useState(collectors);

    // Chart A Data Filtering
    // Mocking specific data for the selected associate based on monthlySnapshots shape
    const singleSnapshotData = useMemo(() => {
        return performanceData.map(d => ({
            month: d.month,
            delinquent: d[selectedAssociate].del,
            cured: d[selectedAssociate].cur
        }));
    }, [selectedAssociate, performanceData]);

    // Chart B Data Processing
    const comparisonData = useMemo(() => {
        // Showing rolling last 6 months
        return performanceData.slice(-6).map(d => {
            const item = { month: d.month };
            selectedComparison.forEach(c => {
                item[`${c} Delinq`] = d[c].del;
                item[`${c} Cured`] = d[c].cur;
            });
            return item;
        });
    }, [selectedComparison, performanceData]);

    const toggleComparison = (collector) => {
        setSelectedComparison(prev =>
            prev.includes(collector)
                ? prev.filter(c => c !== collector)
                : [...prev, collector]
        );
    };

    const COLORS = [
        '#6366f1', // Indigo (Primary)
        '#8b5cf6', // Violet
        '#ec4899', // Pink
        '#f59e0b', // Amber
    ];

    const LIGHT_COLORS = [
        '#a5b4fc', // Light Indigo
        '#c4b5fd', // Light Violet
        '#f9a8d4', // Light Pink
        '#fcd34d', // Light Amber
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Associate Performance Dashboard</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Month-end snapshots and comparative performance analytics.</p>
                </div>
            </div>

            {/* Chart A: Associate Month-End Snapshot */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <Calendar size={18} color="var(--primary)" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Associate Month-End Snapshot</h3>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Monthly count of Delinquent vs Cured accounts for January – December</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-main)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <Users size={16} color="var(--text-muted)" />
                        <select
                            value={selectedAssociate}
                            onChange={(e) => setSelectedAssociate(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer' }}
                        >
                            {collectors.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={singleSnapshotData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tick={{ fill: 'var(--text-muted)', fontWeight: 500 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                width={40}
                                tick={{ fill: 'var(--text-muted)', fontWeight: 500 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                            <Bar
                                dataKey="delinquent"
                                name="Delinquent Accounts"
                                fill="var(--danger)"
                                radius={[4, 4, 0, 0]}
                                barSize={25}
                            >
                                <LabelList dataKey="delinquent" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                            </Bar>
                            <Bar
                                dataKey="cured"
                                name="Cured Accounts"
                                fill="var(--success)"
                                radius={[4, 4, 0, 0]}
                                barSize={25}
                            >
                                <LabelList dataKey="cured" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Chart B: Associate Performance Comparison */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <TrendingUp size={18} color="var(--primary)" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Associate Performance Comparison</h3>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Rolling 6-month window comparative analysis across selected associates</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {collectors.map((c, i) => (
                                <button
                                    key={c}
                                    onClick={() => toggleComparison(c)}
                                    style={{
                                        fontSize: '0.75rem',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        borderColor: selectedComparison.includes(c) ? COLORS[i % COLORS.length] : 'var(--border)',
                                        background: selectedComparison.includes(c) ? COLORS[i % COLORS.length] : 'white',
                                        color: selectedComparison.includes(c) ? 'white' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                        boxShadow: selectedComparison.includes(c) ? `0 4px 6px -1px ${COLORS[i % COLORS.length]}80` : 'none'
                                    }}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        background: '#f8fafc',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        marginTop: '0.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column-reverse',
                                width: 10,
                                height: 20,
                                borderRadius: '2px',
                                overflow: 'hidden',
                                border: '1px solid #cbd5e1'
                            }}>
                                <div style={{ flex: 1.5, background: '#475569' }} />
                                <div style={{ flex: 1, background: '#cbd5e1' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>Stacked View</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Cured (Top) • Delinq (Base)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tick={{ fill: 'var(--text-muted)', fontWeight: 500 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                width={40}
                                tick={{ fill: 'var(--text-muted)', fontWeight: 500 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                shared={false}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            {selectedComparison.map((c, i) => (
                                <React.Fragment key={c}>
                                    <Bar
                                        dataKey={`${c} Delinq`}
                                        name={`${c} Delinq`}
                                        fill={COLORS[i % COLORS.length]}
                                        stackId={c}
                                        radius={[0, 0, 0, 0]}
                                        barSize={selectedComparison.length > 2 ? 20 : 35}
                                    >
                                        <LabelList dataKey={`${c} Delinq`} position="insideTop" style={{ fontSize: '9px', fontWeight: 600, fill: 'white' }} />
                                    </Bar>
                                    <Bar
                                        dataKey={`${c} Cured`}
                                        name={`${c} Cured`}
                                        fill={LIGHT_COLORS[i % LIGHT_COLORS.length]}
                                        stackId={c}
                                        radius={[4, 4, 0, 0]}
                                        barSize={selectedComparison.length > 2 ? 20 : 35}
                                    >
                                        <LabelList dataKey={`${c} Cured`} position="top" style={{ fontSize: '9px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                    </Bar>
                                </React.Fragment>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AssociatePerformance;
