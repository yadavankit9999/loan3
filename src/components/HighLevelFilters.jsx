import React from 'react';
import { Landmark, Layers, MapPin, ShieldCheck, XCircle, Filter } from 'lucide-react';

const HighLevelFilters = ({ onFilterChange }) => {
    const filterStyles = {
        container: {
            display: 'flex',
            alignItems: 'stretch',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            marginBottom: '1.5rem',
            overflow: 'hidden',
        },
        searchSection: {
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.5rem',
            background: '#f8fafc',
            borderRight: '1px solid #e2e8f0',
            color: '#64748b'
        },
        filterGroup: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0.75rem 1.25rem',
            borderRight: '1px solid #f1f5f9',
            transition: 'background 0.2s ease',
            cursor: 'pointer',
        },
        labelWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem'
        },
        label: {
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        },
        select: {
            border: 'none',
            outline: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#1e293b',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            width: '100%'
        },
        resetBtn: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 1.25rem',
            color: '#94a3b8',
            cursor: 'pointer',
            transition: 'color 0.2s',
            border: 'none',
            background: 'transparent'
        }
    };

    return (
        <div style={filterStyles.container}>
            <div style={filterStyles.searchSection} title="Filter Portfolio">
                <Filter size={20} />
            </div>

            {/* Bank Filter */}
            <div style={filterStyles.filterGroup}>
                <div style={filterStyles.labelWrapper}>
                    <Landmark size={12} color="#6366f1" />
                    <label style={filterStyles.label}>Entity / Bank</label>
                </div>
                <select style={filterStyles.select} defaultValue="East West Bank">
                    <option>East West Bank</option>
                    <option disabled>Other Entity</option>
                </select>
            </div>

            {/* Loan Type Filter */}
            <div style={filterStyles.filterGroup}>
                <div style={filterStyles.labelWrapper}>
                    <Layers size={12} color="#6366f1" />
                    <label style={filterStyles.label}>Loan Product</label>
                </div>
                <select 
                    style={filterStyles.select} 
                    onChange={(e) => onFilterChange?.('loanType', e.target.value)}
                >
                    <option value="All">All Products</option>
                    <option>Conventional</option>
                    <option>ARM</option>
                    <option>Foreign National</option>
                    <option>Specialty</option>
                    <option>Equity</option>
                    <option>Construction</option>
                </select>
            </div>

            {/* State Filter */}
            <div style={filterStyles.filterGroup}>
                <div style={filterStyles.labelWrapper}>
                    <MapPin size={12} color="#6366f1" />
                    <label style={filterStyles.label}>Geography / State</label>
                </div>
                <select 
                    style={filterStyles.select} 
                    onChange={(e) => onFilterChange?.('state', e.target.value)}
                >
                    <option value="All">All States</option>
                    <option>CA</option>
                    <option>NY</option>
                    <option>TX</option>
                    <option>FL</option>
                    <option>WA</option>
                </select>
            </div>

            {/* Delinquency Filter */}
            <div style={{ ...filterStyles.filterGroup, borderRight: 'none' }}>
                <div style={filterStyles.labelWrapper}>
                    <ShieldCheck size={12} color="#6366f1" />
                    <label style={filterStyles.label}>Risk Status</label>
                </div>
                <select 
                    style={filterStyles.select} 
                    onChange={(e) => onFilterChange?.('delinquency', e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option>Current</option>
                    <option>30-Day</option>
                    <option>60-Day</option>
                    <option>90-Day</option>
                </select>
            </div>

            <button 
                style={filterStyles.resetBtn} 
                onClick={() => window.location.reload()} 
                title="Reset Filters"
                onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
                <XCircle size={20} />
            </button>
        </div>
    );
};

export default HighLevelFilters;
