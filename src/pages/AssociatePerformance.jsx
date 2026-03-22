import React, { useState, useMemo, useEffect, useRef } from 'react';
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
    const { performanceData, Associates } = associatePerformance;

    // States for single associate snapshot (Chart A)
    const [selectedAssociate, setSelectedAssociate] = useState(Associates[0]);

    // States for multi-associate comparison (Chart B)
    const [selectedComparison, setSelectedComparison] = useState(Associates.slice(0, 3));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Chart A Data Filtering
    const singleSnapshotData = useMemo(() => {
        if (!selectedAssociate || !performanceData) return [];
        return performanceData.map(d => ({
            month: d.month,
            delinquent: d[selectedAssociate]?.del || 0,
            cured: d[selectedAssociate]?.cur || 0
        }));
    }, [selectedAssociate, performanceData]);

    const comparisonData = useMemo(() => {
        if (!selectedComparison || !performanceData) return [];
        return performanceData.slice(-6).map(d => {
            const item = { month: d.month };
            selectedComparison.forEach(c => {
                if (d[c]) {
                    item[`${c} Delinq`] = d[c].del;
                    item[`${c} Cured`] = d[c].cur;
                }
            });
            return item;
        });
    }, [selectedComparison, performanceData]);

    const toggleComparison = (Associate) => {
        setSelectedComparison(prev =>
            prev.includes(Associate)
                ? prev.filter(c => c !== Associate)
                : (prev.length < 5 ? [...prev, Associate] : prev)
        );
    };

    const COLORS = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
        '#3b82f6', '#f43f5e', '#84cc16', '#06b6d4', '#d946ef'
    ];
    const LIGHT_COLORS = COLORS.map(c => `${c}80`);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Associate Performance Dashboard</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Month-end snapshots and comparative performance analytics.</p>
                </div>
            </div>


            <div className="charts-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                                {Associates.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={singleSnapshotData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'var(--text-muted)', fontWeight: 500 }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={40} tick={{ fill: 'var(--text-muted)', fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                                <Bar dataKey="delinquent" name="Delinquent Accounts" fill="var(--danger)" radius={[4, 4, 0, 0]} barSize={25}>
                                    <LabelList dataKey="delinquent" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                                <Bar dataKey="cured" name="Cured Accounts" fill="var(--success)" radius={[4, 4, 0, 0]} barSize={25}>
                                    <LabelList dataKey="cured" position="top" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart B: Associate Performance Comparison */}
                <div className="card" style={{ padding: '1.5rem', minHeight: '520px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <TrendingUp size={18} color="var(--primary)" />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Associate Performance Comparison</h3>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select up to 5 associates to compare rolling monthly performance trends</p>

                                {/* Multi-Select Dropdown Container */}
                                <div ref={dropdownRef} style={{ position: 'relative', width: '380px', zIndex: 100 }}>
                                    <div style={{
                                        width: '100%',
                                        minHeight: '40px',
                                        padding: '4px 10px',
                                        border: '1px solid var(--border)',
                                        borderRadius: '10px',
                                        background: 'white',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        gap: '6px',
                                        cursor: 'pointer'
                                    }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                        {selectedComparison.length === 0 ? (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Select Associates...</span>
                                        ) : (
                                            selectedComparison.map((c, i) => {
                                                const color = COLORS[i % COLORS.length];
                                                return (
                                                    <div key={c} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        padding: '2px 8px',
                                                        background: `${color}15`,
                                                        border: `1px solid ${color}40`,
                                                        borderRadius: '6px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        color: color
                                                    }}>
                                                        {c}
                                                        <span onClick={(e) => { e.stopPropagation(); toggleComparison(c); }} style={{ marginLeft: '4px', cursor: 'pointer', opacity: 0.7 }}>×</span>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>{selectedComparison.length}/5</span>
                                            <Filter size={14} color="var(--text-muted)" />
                                        </div>
                                    </div>

                                    {isDropdownOpen && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            marginTop: '4px',
                                            background: 'white',
                                            border: '1px solid var(--border)',
                                            borderRadius: '10px',
                                            padding: '4px',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                            maxHeight: '200px',
                                            overflowY: 'auto'
                                        }}>
                                            {Associates.map((c, i) => (
                                                <div 
                                                    key={c}
                                                    onClick={() => toggleComparison(c)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        cursor: !selectedComparison.includes(c) && selectedComparison.length >= 5 ? 'not-allowed' : 'pointer',
                                                        background: selectedComparison.includes(c) ? 'var(--bg-muted)' : 'transparent',
                                                        color: selectedComparison.includes(c) ? 'var(--primary)' : 'var(--text-main)',
                                                        fontWeight: selectedComparison.includes(c) ? 700 : 500,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    {c}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: 'var(--bg-main)',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column-reverse', width: 10, height: 20, borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                        <div style={{ flex: 1.5, background: '#475569' }} />
                                        <div style={{ flex: 1, background: '#cbd5e1' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-main)' }}>Comparison View</span>
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Cured (Top) • Delinq (Base)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'var(--text-muted)', fontWeight: 500 }} />
                                    <YAxis axisLine={false} tickLine={false} fontSize={12} width={40} tick={{ fill: 'var(--text-muted)', fontWeight: 500 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    {selectedComparison.map((c, i) => (
                                        <React.Fragment key={c}>
                                            <Bar dataKey={`${c} Delinq`} name={`${c} Delinq`} fill={COLORS[i % COLORS.length]} stackId={c} barSize={20}>
                                                <LabelList dataKey={`${c} Delinq`} position="insideTop" style={{ fontSize: '9px', fontWeight: 600, fill: 'white' }} />
                                            </Bar>
                                            <Bar dataKey={`${c} Cured`} name={`${c} Cured`} fill={LIGHT_COLORS[i % LIGHT_COLORS.length]} stackId={c} radius={[4, 4, 0, 0]} barSize={20}>
                                                <LabelList dataKey={`${c} Cured`} position="top" style={{ fontSize: '9px', fontWeight: 600, fill: 'var(--text-main)' }} />
                                            </Bar>
                                        </React.Fragment>
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssociatePerformance;
