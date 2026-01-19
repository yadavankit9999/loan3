import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ShieldAlert,
  HelpingHand,
  Search,
  Bell,
  ChevronRight,
  Filter,
  Menu,
  X,
  Target,
  TrendingUp,
  Sliders,
  LineChart,
  ClipboardCheck,
  PieChart,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardData } from './DataLoader';
import PortfolioOverview from './pages/PortfolioOverview';
import OperationalDiagnostics from './pages/OperationalDiagnostics';
import CoachingInsights from './pages/CoachingInsights';
import LoanPerformance from './pages/LoanPerformance';
import RiskSegmentation from './pages/RiskSegmentation';
import RiskForecasting from './pages/RiskForecasting';
import LossMitigation from './pages/LossMitigation';
import AssistanceEffectiveness from './pages/AssistanceEffectiveness';
import AssistanceStrategy from './pages/AssistanceStrategy';

const App = () => {
  const [activeTab, setActiveTab] = useState('1A');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState(['G1', 'G2', 'G3']);
  const mainContentRef = useRef(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    getDashboardData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const navGroups = [
    {
      id: 'G1',
      title: 'Performance & Ops',
      items: [
        { id: '1A', label: 'Associate Overview', icon: LayoutDashboard },
        { id: '1B', label: 'Operational Diagnostics', icon: Activity },
        { id: '1C', label: 'Coaching Insights', icon: ShieldAlert },
      ]
    },
    {
      id: 'G2',
      title: 'Risk Analysis',
      items: [
        { id: '2A', label: 'Loan Performance', icon: BarChart3 },
        { id: '2B', label: 'Risk Segmentation', icon: Target },
        { id: '2C', label: 'Risk Forecasting', icon: TrendingUp },
      ]
    },
    {
      id: 'G3',
      title: 'Customer Assistance',
      items: [
        { id: '3A', label: 'Loss Mitigation', icon: HelpingHand },
        { id: '3B', label: 'Assistance Effectiveness', icon: PieChart },
        { id: '3C', label: 'Assistance Strategy', icon: Sliders },
      ]
    }
  ];

  const allItems = navGroups.flatMap(g => g.items);

  const handleCycle = (direction) => {
    const currentIndex = allItems.findIndex(item => item.id === activeTab);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % allItems.length;
    } else {
      nextIndex = (currentIndex - 1 + allItems.length) % allItems.length;
    }
    setActiveTab(allItems[nextIndex].id);
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  return (
    <>
      <button className={`nav-arrow left ${sidebarOpen ? 'sidebar-open' : ''}`} onClick={() => handleCycle('prev')} title="Previous Page">
        <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
      </button>
      <button className="nav-arrow right" onClick={() => handleCycle('next')} title="Next Page">
        <ChevronRight size={24} />
      </button>

      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div className="logo-container">
            <img src="/logo.webp" alt="Logo" className="logo-img" onError={(e) => e.target.style.display = 'none'} />
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.5px', marginTop: '0.25rem' }}>LoanPulse</h1>
          </div>
          <button
            className="mobile-close-btn"
            onClick={() => setSidebarOpen(false)}
            style={{ marginTop: '0.5rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="nav-links">
          {navGroups.map(group => (
            <div key={group.id} className="nav-group">
              <button
                className={`nav-group-header ${!sidebarOpen ? 'centered' : ''}`}
                onClick={() => toggleGroup(group.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Menu size={14} style={{ opacity: 0.5 }} />
                  {sidebarOpen && <span className="group-title">{group.title}</span>}
                </div>
                {sidebarOpen && (
                  <ChevronRight
                    size={14}
                    style={{
                      transition: 'transform 0.2s',
                      transform: expandedGroups.includes(group.id) ? 'rotate(90deg)' : 'none'
                    }}
                  />
                )}
              </button>

              <AnimatePresence>
                {expandedGroups.includes(group.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="nav-group-items"
                  >
                    {group.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`nav-link sub-link ${activeTab === item.id ? 'active' : ''}`}
                      >
                        <item.icon size={18} style={{ minWidth: '18px', flexShrink: 0 }} />
                        <span style={{ transition: 'opacity 0.2s', opacity: sidebarOpen ? 1 : 0, whiteSpace: 'nowrap' }}>{item.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

      </aside>

      <main className="main-content" ref={mainContentRef}>
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sidebar-toggle-btn"
            >
              <Menu size={18} />
            </button>
            <h2 className="page-title">
              {allItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="header-search">
              <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search resources..."
              />
            </div>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', position: 'relative' }}>
              <Bell size={22} />
              <span style={{
                position: 'absolute', top: -2, right: -2, width: 8, height: 8,
                background: 'var(--danger)', borderRadius: '50%', border: '2px solid white'
              }}></span>
            </button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
              TC
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="dashboard-grid"
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
                <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Loading Portfolio Data...</p>
              </div>
            ) : (
              activeTab === '1A' ? <PortfolioOverview data={data} /> :
                activeTab === '1B' ? <OperationalDiagnostics data={data} /> :
                  activeTab === '1C' ? <CoachingInsights data={data} /> :
                    activeTab === '2A' ? <LoanPerformance data={data} /> :
                      activeTab === '2B' ? <RiskSegmentation data={data} /> :
                        activeTab === '2C' ? <RiskForecasting data={data} /> :
                          activeTab === '3A' ? <LossMitigation data={data} /> :
                            activeTab === '3B' ? <AssistanceEffectiveness data={data} /> :
                              activeTab === '3C' ? <AssistanceStrategy data={data} /> :
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                  <h3 style={{ marginBottom: '1rem' }}>Page {activeTab} Coming Soon</h3>
                                  <p>We are currently building this section of the dashboard.</p>
                                </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
};

export default App;
