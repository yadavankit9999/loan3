import React from 'react';
import { 
    Landmark, 
    Layers, 
    MapPin, 
    ShieldCheck, 
    XCircle, 
    Filter, 
    Home, 
    Building2, 
    Hash,
    Map
} from 'lucide-react';

const HighLevelFilters = ({ onFilterChange, activeTab }) => {
    const is1A1B = ['1A', '1B'].includes(activeTab);
    const is1C1D = ['1C', '1D'].includes(activeTab);
    const isPerformanceOps = ['1A', '1B', '1C', '1D'].includes(activeTab);

    const filterStyles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '0.5rem',
        },
        row: {
            display: 'flex',
            alignItems: 'stretch',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            overflow: 'hidden',
        },
        searchSection: {
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.25rem',
            background: '#f8fafc',
            borderRight: '1px solid #e2e8f0',
            color: '#64748b'
        },
        filterGroup: (inactive) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0.5rem 1rem',
            borderRight: '1px solid #f1f5f9',
            opacity: inactive ? 0.4 : 1,
            pointerEvents: inactive ? 'none' : 'auto',
            background: inactive ? '#f8fafc' : 'transparent',
        }),
        groupLabel: {
            fontSize: '0.6rem',
            fontWeight: 800,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '0 1rem',
            marginBottom: '-0.25rem'
        },
        labelWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.15rem'
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
            fontSize: '0.85rem',
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
            {/* Row 1: Core Filters & Geography */}
            <div style={filterStyles.row}>
                <div style={filterStyles.searchSection} title="Core Portfolio Filters">
                    <Filter size={18} />
                </div>

                {/* Relabeled: Loan Type */}
                <div style={filterStyles.filterGroup(is1C1D)}>
                    <div style={filterStyles.labelWrapper}>
                        <Layers size={12} color="#6366f1" />
                        <label style={filterStyles.label}>Loan Type</label>
                    </div>
                    <select style={filterStyles.select} onChange={(e) => onFilterChange?.('loanType', e.target.value)}>
                        <option value="All">All Types</option>
                        <option>Conventional</option>
                        <option>ARM</option>
                        <option>Foreign National</option>
                        <option>Specialty</option>
                        <option>Equity</option>
                        <option>Construction</option>
                        <option>Lot</option>
                    </select>
                </div>

                {/* New: Investor Code - Restricted */}
                <div style={filterStyles.filterGroup(is1C1D)}>
                    <div style={filterStyles.labelWrapper}>
                        <Landmark size={12} color="#6366f1" />
                        <label style={filterStyles.label}>Investor Code</label>
                    </div>
                    <select style={filterStyles.select} onChange={(e) => onFilterChange?.('investor', e.target.value)}>
                        <option value="All">All Investors</option>
                        <option>EWB-Int</option>
                        <option>FNMA</option>
                        <option>FHLMC</option>
                        <option>GNMA</option>
                        <option>PRIV</option>
                    </select>
                </div>

                {/* Geography Section */}
                <div style={{ ...filterStyles.filterGroup(false), flex: 0.8, background: '#f8fafc', borderRight: 'none' }}>
                    <label style={{ ...filterStyles.label, color: 'var(--primary)', marginBottom: '0.25rem' }}>GEOGRAPHY</label>
                </div>

                {/* New: Region Filter */}
                <div style={filterStyles.filterGroup(false)}>
                    <div style={filterStyles.labelWrapper}>
                        <Map size={12} color="#6366f1" />
                        <label style={filterStyles.label}>Region</label>
                    </div>
                    <select style={filterStyles.select} onChange={(e) => onFilterChange?.('region', e.target.value)}>
                        <option value="All">All Regions</option>
                        <option>East</option>
                        <option>West</option>
                        <option>North</option>
                        <option>South</option>
                    </select>
                </div>

                {/* Refactored: State Filter */}
                <div style={filterStyles.filterGroup(false)}>
                    <div style={filterStyles.labelWrapper}>
                        <MapPin size={12} color="#6366f1" />
                        <label style={filterStyles.label}>State</label>
                    </div>
                    <select style={filterStyles.select} onChange={(e) => onFilterChange?.('state', e.target.value)}>
                        <option value="All">All States</option>
                        <option>CA</option>
                        <option>NY</option>
                        <option>TX</option>
                        <option>FL</option>
                        <option>WA</option>
                    </select>
                </div>

                {/* Relabeled: Delinquency Type */}
                <div style={{ ...filterStyles.filterGroup(false), borderRight: 'none' }}>
                    <div style={filterStyles.labelWrapper}>
                        <ShieldCheck size={12} color="#6366f1" />
                        <label style={filterStyles.label}>Delinquency Type</label>
                    </div>
                    <select style={filterStyles.select} onChange={(e) => onFilterChange?.('delinquency', e.target.value)}>
                        <option value="All">All Buckets</option>
                        <option>16 - 29</option>
                        <option>30 - 59</option>
                        <option>60 - 89</option>
                        <option>90+</option>
                    </select>
                </div>

                <button 
                    style={filterStyles.resetBtn} 
                    onClick={() => window.location.reload()} 
                    title="Reset All Filters"
                >
                    <XCircle size={18} />
                </button>
            </div>

            {/* Row 2: Occupancy, Stop Code, Property, Product */}
            <div style={filterStyles.row}>
                <div style={{ ...filterStyles.searchSection, background: '#f1f5f9' }} title="Secondary Filters">
                    <Sliders size={18} />
                </div>

                {/* New: Occupancy Code - Restricted */}
                <div style={filterStyles.filterGroup(is1C1D)}>
                    <div style={filterStyles.labelWrapper}>
                        <Home size={12} color="#6366f1" />
                        <label style={filterStyles.label}>Occupancy Code</label>
                    </div>
                    <select style={filterStyles.select} onChange={(e) => onFilterChange?.('occupancy', e.target.value)}>
                        <option value="All">All Occupancy</option>
                        <option value="1">(1) Primary Residence</option>
                        <option value="2">(2) Second Home</option>
                        <option value="3">(3) Investment Property</option>
                        <option value="4">(4) Non-Owner Occupied</option>
                    </select>
                </div>

                {/* New: Stop Code - Restricted */}
                <div style={filterStyles.filterGroup(is1A1B || is1C1D)}>
                    <div style={filterStyles.labelWrapper}>
                        <XCircle size={12} color="#ef4444" />
                        <label style={filterStyles.label}>Stop Code</label>
                    </div>
                    <select style={filterStyles.select} onChange={(e) => onFilterChange?.('stopCode', e.target.value)}>
                        <option value="All">All Stop Codes</option>
                        <option value="B">(B)ankruptcy</option>
                        <option value="F">(F)oreclosure</option>
                        <option value="L">(L)egal/Litigation</option>
                        <option value="D">(D)isaster - Natural</option>
                        <option value="M">(M)ilitary Protection</option>
                        <option value="O">L(O)ss Mitigation</option>
                        <option value="S">(S)uccessor in Interest</option>
                        <option value="P">(P)aid In Full</option>
                        <option value="R">(R)eal Estate Owned</option>
                        <option value="T">(T)ransfer - Servicing</option>
                    </select>
                </div>

                {/* New: Property Type - Restricted (Active except Performance & Ops) */}
                <div style={filterStyles.filterGroup(is1A1B)}>
                    <div style={filterStyles.labelWrapper}>
                        <Building2 size={12} color="#6366f1" />
                        <label style={filterStyles.label}>Property Type</label>
                    </div>
                    <select style={filterStyles.select} onChange={(e) => onFilterChange?.('propertyType', e.target.value)}>
                        <option value="All">All Properties</option>
                        <option>Residential Property (1 - 4 Units)</option>
                        <option>Commercial & Multi-Family (5+ Units)</option>
                    </select>
                </div>

                {/* New: Product Line - Restricted (Active except Performance & Ops) */}
                <div style={{ ...filterStyles.filterGroup(is1A1B), borderRight: 'none' }}>
                    <div style={filterStyles.labelWrapper}>
                        <Hash size={12} color="#6366f1" />
                        <label style={filterStyles.label}>Product Line</label>
                    </div>
                    <select style={filterStyles.select} onChange={(e) => onFilterChange?.('productLine', e.target.value)}>
                        <option value="All">All Lines</option>
                        <option value="CON">(CON)sumer Residential</option>
                        <option value="CRE">(CRE) Commercial Real Estate</option>
                        <option value="SPE">(SPE)cialty Lending</option>
                    </select>
                </div>

                <div style={{ width: '48px' }} /> {/* Spacer to align with reset btn above */}
            </div>
        </div>
    );
};

// Dummy slider icon since lucide-react name is different
const Sliders = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
        <line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" /><line x1="18" y1="16" x2="22" y2="16" />
    </svg>
);

export default HighLevelFilters;
