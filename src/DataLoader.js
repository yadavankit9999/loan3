import Papa from 'papaparse';

const BASE_URL = '/data/';

export const fetchData = async (fileName) => {
    return new Promise((resolve, reject) => {
        Papa.parse(`${BASE_URL}${fileName}`, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                resolve(results.data.filter(row => Object.keys(row).length > 1));
            },
            error: (err) => {
                reject(err);
            }
        });
    });
};

export const processDashboardSlices = (associates, enrichedLoans) => {
    const regions = ['North', 'South', 'East', 'West'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const shortMonths = months.slice(0, 6);

    // 1A: Portfolio Overview
    const portfolioStats = {
        totalLoans: enrichedLoans.length.toLocaleString(),
        totalAccounts: enrichedLoans.length.toLocaleString(),
        delinquencyRate: ((enrichedLoans.filter(l => l.daysPastDue > 30).length / Math.max(1, enrichedLoans.length)) * 100).toFixed(1),
        portfolioValue: `$${(enrichedLoans.reduce((sum, l) => sum + l.currBal, 0) / 1e6).toFixed(1)}M`,
        totalVolume: `$${(enrichedLoans.reduce((sum, l) => sum + l.currBal, 0) / 1e6).toFixed(1)}M`,
        avgFico: Math.round(enrichedLoans.reduce((sum, l) => sum + (l.fico || 0), 0) / Math.max(1, enrichedLoans.length)),
        weightedFico: Math.round(enrichedLoans.reduce((sum, l) => sum + (l.fico || 0), 0) / Math.max(1, enrichedLoans.length)),
        avgLtv: (enrichedLoans.reduce((sum, l) => sum + (l.ltv || 0), 0) / Math.max(1, enrichedLoans.length)).toFixed(1),
        suspenseTotal: `$${(enrichedLoans.reduce((sum, l) => sum + (l.suspenseBalance || 0), 0) / 1e3).toFixed(1)}k`,
        kpis: [
            { label: 'Total Portfolio Volume', value: `$${(enrichedLoans.reduce((sum, l) => sum + l.currBal, 0) / 1e6).toFixed(1)}M`, trend: '+2.1%', up: true },
            { label: 'Active Delinquency Rate', value: `${((enrichedLoans.filter(l => l.daysPastDue > 0).length / Math.max(1, enrichedLoans.length)) * 100).toFixed(1)}%`, trend: '-0.4%', up: true },
            { label: 'Avg Portfolio FICO', value: Math.round(enrichedLoans.reduce((sum, l) => sum + (l.fico || 0), 0) / Math.max(1, enrichedLoans.length)), trend: 'Stable', up: null },
            { label: 'WA Loan-to-Value (LTV)', value: `${(enrichedLoans.reduce((sum, l) => sum + (l.ltv || 0), 0) / Math.max(1, enrichedLoans.length)).toFixed(1)}%`, trend: '-0.2%', up: true }
        ]
    };

    // 1B: Operational Diagnostics
    const diagnostics = {
        kpis: [
            { label: 'Total Delinquent', value: enrichedLoans.filter(l => l.daysPastDue > 0).length.toLocaleString(), trend: '+5%', up: false },
            { label: 'Avg Days Past Due', value: Math.round(enrichedLoans.reduce((sum, l) => sum + (l.daysPastDue || 0), 0) / Math.max(1, enrichedLoans.length)), trend: '+2', up: false },
            { label: 'Migration Velocity', value: 'Medium', trend: 'Increasing', up: false },
            { label: 'Stress Index', value: '42%', trend: '-2%', up: true },
            { label: 'Workload Ratio', value: '1:240', trend: 'Stable', up: null },
            { label: 'Bottleneck Risk', value: 'Low', trend: 'Improving', up: true },
            { label: 'Root Cause Count', value: '14', trend: '-2', up: true }
        ],
        volumeTrend: shortMonths.map(m => ({ month: m, volume: 450 + Math.floor(Math.random() * 150) })),
        scatterData: associates.map((a) => {
            const myLoans = enrichedLoans.filter(l => l["Account Officer"] === a["Account Officer"]);
            return {
                x: Math.round(myLoans.length),
                y: parseFloat(((myLoans.filter(l => l.daysPastDue > 0).length / Math.max(1, myLoans.length)) * 100).toFixed(1)),
                name: a["Account Officer"]
            };
        }),
        weeklyBreakdown: {
            migration: [
                { week: 'Week 1', Migrated: 45, 'Non-Migrated': 120 },
                { week: 'Week 2', Migrated: 52, 'Non-Migrated': 110 },
                { week: 'Week 3', Migrated: 48, 'Non-Migrated': 130 },
                { week: 'Week 4', Migrated: 60, 'Non-Migrated': 115 }
            ],
            outcomes: [
                { week: 'Week 1', Cured: 30, 'Stayed Delinquent': 80, Deteriorated: 20 },
                { week: 'Week 2', Cured: 35, 'Stayed Delinquent': 75, Deteriorated: 15 },
                { week: 'Week 3', Cured: 28, 'Stayed Delinquent': 85, Deteriorated: 25 },
                { week: 'Week 4', Cured: 40, 'Stayed Delinquent': 70, Deteriorated: 18 }
            ]
        },
        groupedComparison: [
            { status: 'Current', Migrated: 10, 'Non-Migrated': 850 },
            { status: '30-Day', Migrated: 45, 'Non-Migrated': 40 },
            { status: '60-Day', Migrated: 30, 'Non-Migrated': 15 },
            { status: '90-Day', Migrated: 25, 'Non-Migrated': 10 }
        ],
        outcomeBreakdown: [
            { outcome: 'Cured', value: 320 },
            { outcome: 'Stayed', value: 450 },
            { outcome: 'Deteriorated', value: 120 }
        ],
        accountDeteriorationFlow: [
            { source: 'Current', target: '30D', value: 120 },
            { source: '30D', target: '60D', value: 85 },
            { source: '60D', target: '90D', value: 42 },
            { source: '90D', target: '120D+', value: 18 }
        ],
        stabilizationMatrix: associates.map(a => ({
            x: Math.floor(Math.random() * 180),
            y: Math.floor(Math.random() * 120),
            z: Math.floor(Math.random() * 500),
            name: a["Account Officer"]
        }))
    };

    // 1C: Coaching Insights
    const coaching = {
        kpis: [
            { label: 'Coach Priority', value: '12', trend: '-2', up: true },
            { label: 'Avg Cure Time', value: '18d', trend: '-2d', up: true },
            { label: 'Action Compliance', value: '94%', trend: '+1%', up: true },
            { label: 'Critical Alerts', value: '5', trend: '-3', up: true },
            { label: 'Peer Variance', value: '4%', trend: 'Stable', up: null },
            { label: 'Escalation Rate', value: '2.1%', trend: '-0.3%', up: true },
            { label: 'Follow-up Gap', value: '1.2d', trend: '-0.2d', up: true }
        ],
        stageFunnel: [
            { stage: '1-30', count: enrichedLoans.filter(l => l.daysPastDue > 0 && l.daysPastDue <= 30).length },
            { stage: '31-60', count: enrichedLoans.filter(l => l.daysPastDue > 30 && l.daysPastDue <= 60).length },
            { stage: '61-90', count: enrichedLoans.filter(l => l.daysPastDue > 60 && l.daysPastDue <= 90).length },
            { stage: '91+', count: enrichedLoans.filter(l => l.daysPastDue > 90).length }
        ],
        timeToCureDist: [
            { range: '< 15d', count: 45 }, { range: '15-30d', count: 120 }, { range: '31-60d', count: 85 }, { range: '60d+', count: 32 }
        ],
        repeatDelinquency: [
            { category: 'Single', Migrated: 45, Stable: 120 },
            { category: 'Repeat', Migrated: 30, Stable: 85 },
            { category: 'Chronic', Migrated: 12, Stable: 40 }
        ],
        riskHeatmap: associates.slice(0, 10).map(a => ({
            name: a["Account Officer"].split(' ').pop(),
            Speed: 60 + Math.floor(Math.random() * 30),
            Quality: 70 + Math.floor(Math.random() * 20),
            Consistency: 50 + Math.floor(Math.random() * 40),
            Compliance: 80 + Math.floor(Math.random() * 15)
        })),
        priorityMatrix: associates.map(a => ({
            x: Math.floor(Math.random() * 60),
            y: Math.floor(Math.random() * 100),
            z: Math.floor(Math.random() * 1000),
            name: a["Account Officer"]
        })),
        suggestedActions: associates.slice(0, 5).map(a => ({
            associate: a["Account Officer"],
            risk: Math.random() > 0.7 ? 'Critical' : 'Warning',
            action: 'Policy Review & Outreach'
        }))
    };

    // 1D: Associate Performance
    const assocPerf = {
        Associates: associates.map(a => a["Account Officer"]),
        performanceData: shortMonths.map(m => {
            const snapshot = { month: m };
            associates.forEach(a => {
                snapshot[a["Account Officer"]] = {
                    del: Math.round(15 + Math.random() * 40),
                    cur: Math.round(10 + Math.random() * 30)
                };
            });
            return snapshot;
        }),
        performanceStats: associates.map(a => {
            const myLoans = enrichedLoans.filter(l => l["Account Officer"] === a["Account Officer"]);
            const delinqCount = myLoans.filter(l => l.daysPastDue > 0).length;
            const delinqRate = ((delinqCount / Math.max(1, myLoans.length)) * 100).toFixed(1);
            const cureRate = (40 + Math.random() * 45).toFixed(1);
            return {
                name: a["Account Officer"],
                region: a.Region,
                accounts: myLoans.length,
                account_count: myLoans.length,
                volume: myLoans.reduce((sum, l) => sum + (l.currBal || 0), 0),
                delinquencyRate: delinqRate,
                delinq_rate: delinqRate,
                cureRate: cureRate,
                cure_rate: cureRate
            };
        })
    };

    // 2A: Loan Analysis
    const analysis = {
        kpis: [
            { label: 'Avg FICO', value: portfolioStats.avgFico, trend: 'Stable', up: null },
            { label: 'Avg LTV', value: `${portfolioStats.avgLtv}%`, trend: '-0.5%', up: true },
            { label: 'High Risk Count', value: enrichedLoans.filter(l => (l.fico || 0) < 640).length.toLocaleString(), trend: '+14', up: false },
            { label: 'Value At Risk', value: `$${(enrichedLoans.filter(l => l.daysPastDue > 90).reduce((sum, l) => sum + (l.currBal || 0), 0) / 1e6).toFixed(1)}M`, trend: '+2%', up: false }
        ],
        delinquencyTrend: shortMonths.map(m => ({ month: m, rate: (3 + Math.random() * 2).toFixed(1) })),
        statusDistribution: [
            { name: 'Current', value: enrichedLoans.filter(l => l.daysPastDue === 0).length },
            { name: '30-60 Days', value: enrichedLoans.filter(l => l.daysPastDue > 0 && l.daysPastDue <= 60).length },
            { name: '60-90 Days', value: enrichedLoans.filter(l => l.daysPastDue > 60 && l.daysPastDue <= 90).length },
            { name: '90+ Days', value: enrichedLoans.filter(l => l.daysPastDue > 90).length }
        ],
        scoreBuckets: [
            { range: '580-620', count: enrichedLoans.filter(l => (l.fico || 0) < 620).length },
            { range: '620-680', count: enrichedLoans.filter(l => (l.fico || 0) >= 620 && (l.fico || 0) < 680).length },
            { range: '680-740', count: enrichedLoans.filter(l => (l.fico || 0) >= 680 && (l.fico || 0) < 740).length },
            { range: '740+', count: enrichedLoans.filter(l => (l.fico || 0) >= 740).length }
        ],
        valueVsRisk: regions.map(r => ({
            region: r,
            value: (Math.random() * 100 + (r === 'West' ? 380 : 300)).toFixed(1),
            riskRate: (Math.random() * 25).toFixed(1)
        })),
        riskSegments: [
            { name: 'Low FICO / High LTV', count: 120, avgDelinquency: 45, vulnerability: 82 },
            { name: 'Specialty Loans', count: 350, avgDelinquency: 12, vulnerability: 35 },
            { name: 'Vintage 2023 Cohort', count: 580, avgDelinquency: 28, vulnerability: 64 },
            { name: 'Investor Group X', count: 90, avgDelinquency: 55, vulnerability: 89 }
        ]
    };

    // 2B: Risk Segmentation
    const segmentation = {
        kpis: [
            { 
                label: 'Regional Variance', 
                value: (() => {
                    const rates = regions.map(r => {
                        const regLoans = enrichedLoans.filter(l => l.Region === r);
                        return regLoans.filter(l => l.daysPastDue > 0).length / Math.max(1, regLoans.length);
                    });
                    const mean = rates.reduce((a, b) => a + b, 0) / rates.length;
                    const variance = rates.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / rates.length;
                    return (Math.sqrt(variance) * 100).toFixed(1) + '%';
                })(),
                trend: '-1.2%', up: true 
            },
            { 
                label: 'Top Risk Region', 
                value: (regions.map(r => ({
                    region: r,
                    rate: (enrichedLoans.filter(l => l.Region === r && l.daysPastDue > 0).length / Math.max(1, enrichedLoans.filter(l => l.Region === r).length))
                })).sort((a, b) => b.rate - a.rate)[0]?.region || 'None'),
                trend: 'Stable', up: null 
            },
            { 
                label: 'Segment Density', 
                value: ((enrichedLoans.filter(l => l.daysPastDue > 0).length / Math.max(1, enrichedLoans.length)) * 100).toFixed(1) + '%',
                trend: 'Increasing', up: false 
            },
            { 
                label: 'Avg LTV (High Risk)', 
                value: (enrichedLoans.filter(l => (l.fico || 0) < 640).reduce((sum, l) => sum + (l.ltv || 0), 0) / Math.max(1, enrichedLoans.filter(l => (l.fico || 0) < 640).length)).toFixed(1) + '%',
                trend: '+2%', up: false 
            }
        ],
        geoDelinquency: regions.map(r => {
            const regLoans = enrichedLoans.filter(l => l.Region === r);
            const delinqCount = regLoans.filter(l => l.daysPastDue > 0).length;
            return {
                region: r,
                delinquencyRate: ((delinqCount / Math.max(1, regLoans.length)) * 100).toFixed(1)
            };
        }),
        scoreVsDelinquency: enrichedLoans.slice(0, 50).map(l => ({
            score: l.fico,
            delinquency: l.daysPastDue,
            amount: Math.round(l.currBal / 1000)
        })),
        loanAgeVsRisk: shortMonths.map((m, i) => ({
            name: (i * 12).toString(),
            riskRate: (5 + Math.random() * 15).toFixed(1)
        })),
        vintageHeatmap: [
            { year: 2021, Jan: 4, Feb: 5, Mar: 6, Apr: 8, May: 10, Jun: 12, Jul: 14, Aug: 15, Sep: 16, Oct: 18, Nov: 20, Dec: 22 },
            { year: 2022, Jan: 2, Feb: 3, Mar: 4, Apr: 5, May: 6, Jun: 8, Jul: 9, Aug: 10, Sep: 12, Oct: 14, Nov: 15, Dec: 18 },
            { year: 2023, Jan: 1, Feb: 1, Mar: 2, Apr: 2, May: 3, Jun: 4, Jul: 5, Aug: 6, Sep: 7, Oct: 8, Nov: 10, Dec: 12 }
        ],
        segmentContribution: regions.map(r => ({
            region: r,
            'Low Risk': enrichedLoans.filter(l => l.Region === r && (l.fico || 0) >= 720).length,
            'Medium Risk': enrichedLoans.filter(l => l.Region === r && (l.fico || 0) >= 640 && (l.fico || 0) < 720).length,
            'High Risk': enrichedLoans.filter(l => l.Region === r && (l.fico || 0) < 640).length,
        }))
    };

    // 2C: Risk Forecasting
    const forecasting = {
        kpis: [
            { label: '90D EAD Forecast', value: `$${(enrichedLoans.filter(l => l.daysPastDue > 90).reduce((sum, l) => sum + (l.currBal || 0), 0) * 1.5 / 1e6).toFixed(1)}M`, trend: '+4%', up: false },
            { label: 'PD Velocity', value: 'Low', trend: 'Improving', up: true },
            { label: 'Recovery Rate', value: '62%', trend: '+2%', up: true },
            { label: 'Liquidity Stress', value: 'Minimal', trend: 'Stable', up: null }
        ],
        delinquencyForecast: [
            { month: 'Jan', type: 'Historical', rate: 4.2 }, { month: 'Feb', type: 'Historical', rate: 4.4 },
            { month: 'Mar', type: 'Historical', rate: 4.1 }, { month: 'Apr', type: 'Projected', rate: 4.3 },
            { month: 'May', type: 'Projected', rate: 4.5 }, { month: 'Jun', type: 'Projected', rate: 4.7 }
        ],
        transitionMatrix: [
            { from: 'Current', to: '30-60', value: 4 },
            { from: '30-60', to: 'Current', value: 65 },
            { from: '30-60', to: '60-90', value: 12 },
            { from: '60-90', to: '90+', value: 25 }
        ],
        earlyWarningSignals: [
            { signal: 'FICO Drop > 30pts', count: 42, risk: 'High', impact: 'High' },
            { signal: 'Multiple NSF', count: 18, risk: 'Critical', impact: 'Critical' },
            { signal: 'Employment Gap', count: 65, risk: 'Medium', impact: 'Medium' }
        ],
        riskFunnelData: [
            { step: 'Healthy', value: enrichedLoans.filter(l => l.daysPastDue === 0).length, label: 'Healthy' },
            { step: 'At Risk', value: enrichedLoans.filter(l => l.daysPastDue > 0 && l.daysPastDue <= 60).length, label: 'Early Warning' },
            { step: 'Delinquent', value: enrichedLoans.filter(l => l.daysPastDue > 60).length, label: 'Critical' }
        ],
        riskScoreBuckets: [
            { range: '0-20', count: 450, bucket: 'Low', name: 'Low' },
            { range: '21-50', count: 320, bucket: 'Med', name: 'Medium' },
            { range: '51-100', count: 130, bucket: 'High', name: 'Critical' }
        ],
        decisionInsights: [
            { id: 1, message: 'Increase outreach for Specialty loans in South region', impact: 'High', type: 'critical' },
            { id: 2, message: 'Review LTV for 2023 vintage cohort', impact: 'Medium', type: 'warning' },
            { id: 3, message: 'High FICO drop detected in New York portfolio', impact: 'Medium', type: 'warning' }
        ]
    };

    // 3A: Loss Mitigation
    const lossMitigation = {
        kpis: [
            { label: 'Active Programs', value: enrichedLoans.filter(l => l["Stop Code"] !== 'None').length.toLocaleString(), trend: '+52', up: true },
            { label: 'Mod Success Rate', value: '78%', trend: '+3%', up: true },
            { label: 'Avg Processing', value: '14d', trend: '-2d', up: true },
            { label: 'Pending Docs', value: '124', trend: '-12', up: true }
        ],
        programDistribution: [
            { name: 'Mod', value: Math.max(5, enrichedLoans.filter(l => l["Stop Code"] === 'Mod').length) },
            { name: 'Forbearance', value: Math.max(3, enrichedLoans.filter(l => l["Stop Code"] === 'Forbearance').length) },
            { name: 'REO', value: Math.max(2, enrichedLoans.filter(l => l["Stop Code"] === 'REO').length) },
            { name: 'Legal', value: Math.max(1, enrichedLoans.filter(l => l["Stop Code"] === 'Legal').length) }
        ],
        volumeTrend: shortMonths.map(m => ({ month: m, requests: 120 + Math.floor(Math.random() * 80), completed: 100 + Math.floor(Math.random() * 60) })),
        statusBreakdown: [
            { stage: 'Engagement', doc: 150, review: 200, final: 100 },
            { stage: 'Underwriting', doc: 100, review: 120, final: 60 },
            { stage: 'Approved', doc: 50, review: 80, final: 20 },
            { stage: 'Closed', doc: 30, review: 50, final: 40 }
        ],
        durationDistribution: [
            { range: '0-10d', count: 45 }, { range: '11-20d', count: 30 }, { range: '21-30d', count: 15 }, { range: '30d+', count: 10 }
        ]
    };

    // 3B: Assistance Effectiveness
    const effectiveness = {
        kpis: [
            { label: 'Avg Cure Rate', value: '68%', trend: '+2%', up: true },
            { label: 'Relapse Rate', value: '14%', trend: '-1%', up: true },
            { label: 'Program ROI', value: '4.2x', trend: '+0.4x', up: true },
            { label: 'Time to Cure', value: '22d', trend: '-2d', up: true }
        ],
        cureRateByProgram: [
            { program: 'Mod', rate: 75 }, { program: 'Forbearance', rate: 62 }, { program: 'REO', rate: 45 }, { program: 'Legal', rate: 30 }
        ],
        reDefaultRateByProgram: [
            { program: 'Mod', rate: 12 }, { program: 'Forbearance', rate: 18 }, { program: 'REO', rate: 25 }, { program: 'Legal', rate: 40 }
        ],
        outcomeFunnel: [
            { stage: 'Eligible', count: 1200 }, { stage: 'Engaged', count: 850 }, { stage: 'Applied', count: 600 }, { stage: 'Approved', count: 480 }, { stage: 'Cured', count: 320 }
        ],
        riskVsOutcome: [
            { x: 20, y: 75, z: 400, name: 'Mod Batch A' }, { x: 45, y: 50, z: 200, name: 'Forb. Batch B' }, { x: 70, y: 30, z: 600, name: 'Legal Batch C' }
        ],
        assistanceFrequency: [
            { frequency: '1st Time', count: 850 }, { frequency: '2nd Time', count: 240 }, { frequency: '3rd+', count: 110 }
        ],
        performanceHeatmap: [
            { program: 'Mod', segment: 'Low LTV', score: 92 },
            { program: 'Mod', segment: 'High LTV', score: 78 },
            { program: 'Deferral', segment: 'Low LTV', score: 85 },
            { program: 'Deferral', segment: 'High LTV', score: 62 },
            { program: 'Forbearance', segment: 'Low LTV', score: 74 },
            { program: 'Forbearance', segment: 'High LTV', score: 55 }
        ]
    };

    // 3C: Assistance Strategy
    const strategy = {
        kpis: [
            { label: 'Policy Coverage', value: '82%', trend: '+4%', up: true },
            { label: 'Model Accuracy', value: '91%', trend: 'Stable', up: null },
            { label: 'Optimal Cure Pool', value: '4.2k', trend: '+120', up: true },
            { label: 'Loss Avoidance', value: '$4.2M', trend: '+$0.4M', up: true }
        ],
        usageOutcomeTrend: shortMonths.map(m => ({ month: m, usage: 45 + Math.floor(Math.random() * 40), outcome: 40 + Math.floor(Math.random() * 35) })),
        stressTestData: [
            { scenario: 'Baseline', coverage: 70, impact: 65 },
            { scenario: 'Macro Stress', coverage: 65, impact: 45 },
            { scenario: 'High Delinq', coverage: 80, impact: 85 }
        ],
        customerFlow: [
            { step: 'Eligible', value: 1200 }, { step: 'Engaged', value: 850 }, { step: 'Approved', value: 620 }, { step: 'Cured', value: 480 }
        ],
        policyMatrix: [
            { name: 'Policy A', x: 20, y: 70, z: 400 }, { name: 'Policy B', x: 65, y: 30, z: 200 }, { name: 'Policy C', x: 45, y: 55, z: 600 }
        ],
        roiAnalysis: [
            { program: 'Mod', cost: 120, return: 450 }, { program: 'Deferral', cost: 80, return: 380 }, { program: 'Forbearance', cost: 200, return: 150 }
        ],
        recommendations: [
            { id: 1, policy: 'Auto-Deferral 30D', impact: 'High', feasibility: 'High', action: 'Approved' },
            { id: 2, policy: 'Aggressive Mod South', impact: 'Critical', feasibility: 'Medium', action: 'Pending' }
        ]
    };

    return {
        raw: enrichedLoans,
        portfolio: portfolioStats,
        diagnostics: diagnostics,
        coaching: coaching,
        associatePerformance: assocPerf,
        performance: analysis,
        segmentation: segmentation,
        forecasting: forecasting,
        lossMitigation: lossMitigation,
        effectiveness: effectiveness,
        strategy: strategy,
        kpis: portfolioStats.kpis,
    };
};

export const getDashboardData = async () => {
    try {
        const [associates, loans] = await Promise.all([
            fetchData('associates.csv'),
            fetchData('loans.csv')
        ]);

        const enrichedLoans = loans.map(l => ({
            ...l,
            fico: parseInt(l.FICO) || 700,
            ltv: parseFloat(l["Total LTV"]) || 80,
            currBal: parseFloat(l["Total Bank Balance"]) || 0,
            suspenseBalance: parseFloat(l["Suspense Balance"]) || 0,
            origAmount: parseFloat(l["Orig Appraisal Amount"]) || 0,
            appraisalVal: parseFloat(l["Appraisal Value"]) || 0,
            daysPastDue: parseInt(l["# Days Past Due"]) || 0,
            chargeOff: parseFloat(l["Charge off Amount"]) || 0,
            // New Filter Fields
            "Occup Code": l["Occup Code"] || 'All',
            "Stop Code": l["Stop Code"] || 'All',
            "Property Type": l["Property Type"] || 'All',
            "Product Line": l["Product Line"] || 'All',
            "Investor Code": l["Investor Code"] || 'All',
            "State": l["State"] || 'CA'
        }));

        const fullData = processDashboardSlices(associates, enrichedLoans);
        return {
            ...fullData,
            rawAssociates: associates,
            rawLoans: enrichedLoans
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
};
