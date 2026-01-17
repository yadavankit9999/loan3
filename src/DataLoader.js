import Papa from 'papaparse';

const BASE_URL = '/data/';

export const fetchData = async (fileName) => {
    return new Promise((resolve, reject) => {
        Papa.parse(`${BASE_URL}${fileName}`, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                resolve(results.data.filter(row => Object.keys(row).length > 1)); // Filter empty rows
            },
            error: (err) => {
                reject(err);
            }
        });
    });
};

export const getDashboardData = async () => {
    try {
        const [associates, accounts, loans] = await Promise.all([
            fetchData('associates.csv'),
            fetchData('accounts.csv'),
            fetchData('loans.csv')
        ]);

        // Calculate Page 1A KPIs
        const totalAccounts = accounts.length;
        const totalAssociates = associates.length;
        const avgAccounts = (totalAccounts / totalAssociates).toFixed(1);

        const delinquentAccounts = accounts.filter(a => a.days_delinquent > 0);
        const overallDelinquencyRate = ((delinquentAccounts.length / totalAccounts) * 100).toFixed(1);

        const seriousDelinquent = accounts.filter(a => a.days_delinquent >= 90);
        const seriousDelinquencyRate = ((seriousDelinquent.length / totalAccounts) * 100).toFixed(1);

        const curedAccounts = accounts.filter(a => a.cured_flag === 1);
        const cureRate = ((curedAccounts.length / totalAccounts) * 100).toFixed(1);

        // Page 1B: Migration & Workload Diagnostics
        const migratedAccounts = accounts.filter(a => a.account_id % 5 === 0);
        const nonMigratedAccounts = accounts.filter(a => a.account_id % 5 !== 0);

        const migratedRate = ((migratedAccounts.length / totalAccounts) * 100).toFixed(1);

        const migratedDelinq = migratedAccounts.filter(a => a.days_delinquent > 0);
        const nonMigratedDelinq = nonMigratedAccounts.filter(a => a.days_delinquent > 0);

        const migratedDelinqRate = ((migratedDelinq.length / migratedAccounts.length) * 100).toFixed(1);
        const nonMigratedDelinqRate = ((nonMigratedDelinq.length / nonMigratedAccounts.length) * 100).toFixed(1);

        // Page 2A: Loan Performance Data
        const totalPortfolioValue = loans.reduce((sum, l) => sum + (l.loan_amount || 0), 0);
        const avgLoanSize = (totalPortfolioValue / loans.length).toFixed(0);
        const avgCreditScore = (loans.reduce((sum, l) => sum + (l.credit_score || 0), 0) / loans.length).toFixed(0);

        const delinquentLoans = loans.filter(l => l.days_delinquent > 0);
        const portfolioDelinqRate = ((delinquentLoans.reduce((sum, l) => sum + (l.loan_amount || 0), 0) / totalPortfolioValue) * 100).toFixed(1);

        const highRiskLoans = loans.filter(l => l.risk_segment === 'High Risk');
        const highRiskExposure = ((highRiskLoans.reduce((sum, l) => sum + (l.loan_amount || 0), 0) / totalPortfolioValue) * 100).toFixed(1);

        // Chart 1: Delinquency Trend (Monthly)
        const trendMap = {};
        loans.forEach(l => {
            const date = new Date(l.origination_date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!trendMap[key]) trendMap[key] = { date: key, delinquent: 0, total: 0 };
            trendMap[key].total++;
            if (l.days_delinquent > 0) trendMap[key].delinquent++;
        });
        const delinquencyTrend = Object.values(trendMap)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-12) // Last 12 months
            .map(d => ({ month: d.date, rate: parseFloat(((d.delinquent / d.total) * 100).toFixed(1)) }));

        // Chart 2: Loan Status Distribution (Donut)
        const statusCounts = {
            'Current': loans.filter(l => l.days_delinquent === 0).length,
            '30-60 Days': loans.filter(l => l.days_delinquent > 0 && l.days_delinquent <= 60).length,
            '60-90 Days': loans.filter(l => l.days_delinquent > 60 && l.days_delinquent <= 90).length,
            '90+ Days': loans.filter(l => l.days_delinquent > 90).length,
        };
        const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

        // Chart 3: Value vs Risk (Dual Axis)
        const regionStats = {};
        loans.forEach(l => {
            if (!regionStats[l.region]) regionStats[l.region] = { region: l.region, value: 0, riskCount: 0, total: 0 };
            regionStats[l.region].value += (l.loan_amount || 0);
            regionStats[l.region].total++;
            if (l.risk_segment === 'High Risk' || l.days_delinquent > 60) regionStats[l.region].riskCount++;
        });
        const valueVsRisk = Object.values(regionStats).map(r => ({
            region: r.region,
            value: parseFloat((r.value / 1000000).toFixed(2)), // In Millions
            riskRate: parseFloat(((r.riskCount / r.total) * 100).toFixed(1))
        }));

        // Chart 4: Credit Score Distribution (Histogram)
        const scoreBuckets = [
            { range: '500-550', count: 0 },
            { range: '550-600', count: 0 },
            { range: '600-650', count: 0 },
            { range: '650-700', count: 0 },
            { range: '700-750', count: 0 },
            { range: '750-800', count: 0 },
            { range: '800-850', count: 0 }
        ];
        loans.forEach(l => {
            const score = l.credit_score;
            if (score < 550) scoreBuckets[0].count++;
            else if (score < 600) scoreBuckets[1].count++;
            else if (score < 650) scoreBuckets[2].count++;
            else if (score < 700) scoreBuckets[3].count++;
            else if (score < 750) scoreBuckets[4].count++;
            else if (score < 800) scoreBuckets[5].count++;
            else scoreBuckets[6].count++;
        });

        // Chart 5: Top Risk Segments (Ranked Bar)
        const riskSegmentValue = {};
        loans.forEach(l => {
            if (!riskSegmentValue[l.risk_segment]) riskSegmentValue[l.risk_segment] = 0;
            riskSegmentValue[l.risk_segment] += (l.loan_amount || 0);
        });
        const riskSegments = Object.entries(riskSegmentValue)
            .sort((a, b) => b[1] - a[1])
            .map(([name, value]) => ({ name, value: parseFloat((value / 1000000).toFixed(2)) })); // In Millions

        // Scatter data: Workload vs Delinquency per Associate
        const associatesWithStats = associates.map(assoc => {
            const assocAccounts = accounts.filter(a => a.associate_id === assoc.associate_id);
            const delinqCount = assocAccounts.filter(a => a.days_delinquent > 0).length;
            return {
                ...assoc,
                workload: assocAccounts.length,
                delinqRate: ((delinqCount / assocAccounts.length) * 100).toFixed(1)
            };
        });

        // Page 3A: Loss Mitigation
        const mitigationKpis = [
            { label: 'Pending Requests', value: '1,284', trend: '+12%', up: false },
            { label: 'Approved Mods', value: '3,420', trend: '+5.4%', up: true },
            { label: 'Denial Rate', value: '14.2%', trend: '-2.1%', up: true },
            { label: 'Avg Process Time', value: '12 Days', trend: '-1 Day', up: true },
            { label: 'Escalation Rate', value: '3.8%', trend: '+0.5%', up: false },
            { label: 'Deferrals Active', value: '842', trend: '-4.2%', up: true },
            { label: 'Trial Period Succ.', value: '92%', trend: '+1.2%', up: true },
            { label: 'Net Loss Avoided', value: '$4.2M', trend: '+$240k', up: true }
        ];

        const programDistribution = [
            { name: 'Loan Mod', value: 45 },
            { name: 'Forbearance', value: 25 },
            { name: 'Deferral', value: 20 },
            { name: 'Short Sale', value: 10 }
        ];

        const volumeTrend = [
            { month: 'Jul', requests: 420, completed: 380 },
            { month: 'Aug', requests: 450, completed: 410 },
            { month: 'Sep', requests: 480, completed: 440 },
            { month: 'Oct', requests: 520, completed: 490 },
            { month: 'Nov', requests: 590, completed: 530 },
            { month: 'Dec', requests: 650, completed: 610 }
        ];

        const statusBreakdown = [
            { stage: 'Submission', doc: 120, review: 80, final: 40 },
            { stage: 'Processing', doc: 240, review: 150, final: 90 },
            { stage: 'Decisioning', doc: 310, review: 200, final: 110 },
            { stage: 'Fulfillment', doc: 180, review: 140, final: 40 }
        ];

        const durationDistribution = [
            { range: '0-7d', count: 15 },
            { range: '8-14d', count: 35 },
            { range: '15-21d', count: 25 },
            { range: '22-30d', count: 18 },
            { range: '30d+', count: 7 }
        ];

        // Page 2B: Risk Segmentation Data
        const geoDelinquency = Object.values(regionStats).map(r => ({
            region: r.region,
            delinquencyRate: parseFloat(((r.riskCount / r.total) * 100).toFixed(1))
        }));

        const scoreVsDelinquency = loans.filter((_, i) => i % 10 === 0).map(l => ({
            score: l.credit_score,
            delinquency: l.days_delinquent,
            amount: l.loan_amount / 1000
        }));

        const ageBuckets = {};
        loans.forEach(l => {
            const ageGroup = Math.floor(l.loan_age_months / 12) * 12;
            const key = `${ageGroup}-${ageGroup + 11}m`;
            if (!ageBuckets[key]) ageBuckets[key] = { name: key, riskSum: 0, count: 0 };
            ageBuckets[key].count++;
            if (l.days_delinquent > 60) ageBuckets[key].riskSum++;
        });
        const loanAgeVsRisk = Object.values(ageBuckets).map(b => ({
            name: b.name,
            riskRate: parseFloat(((b.riskSum / b.count) * 100).toFixed(1))
        }));

        const vintageMap = {};
        loans.forEach(l => {
            const date = new Date(l.origination_date);
            const year = date.getFullYear();
            const month = date.toLocaleString('default', { month: 'short' });
            if (!vintageMap[year]) vintageMap[year] = {};
            if (!vintageMap[year][month]) vintageMap[year][month] = { sum: 0, count: 0 };
            vintageMap[year][month].count++;
            if (l.days_delinquent > 30) vintageMap[year][month].sum++;
        });
        const vintageHeatmap = Object.entries(vintageMap).map(([year, months]) => ({
            year,
            ...Object.fromEntries(Object.entries(months).map(([m, data]) => [m, parseFloat(((data.sum / data.count) * 100).toFixed(1))]))
        }));

        const segmentContribution = Object.values(regionStats).map(r => ({
            region: r.region,
            'Low Risk': Math.floor(Math.random() * 40) + 30,
            'Medium Risk': Math.floor(Math.random() * 20) + 10,
            'High Risk': Math.floor(Math.random() * 10) + 2
        }));

        return {
            raw: { associates, accounts, loans },
            kpis: [
                { label: 'Total Active Accounts', value: totalAccounts.toLocaleString(), trend: '+2.4%', up: true },
                { label: 'Total Associates', value: totalAssociates, trend: 'Stable', up: null },
                { label: 'Avg Accounts / Associate', value: avgAccounts, trend: '-1.2%', up: true },
                { label: 'Overall Delinquency Rate', value: `${overallDelinquencyRate}%`, trend: '+0.5%', up: false },
                { label: '90+ Days Delinquency', value: `${seriousDelinquencyRate}%`, trend: '-0.2%', up: true },
                { label: 'New Delinquencies', value: '142', trend: '+12', up: false },
                { label: 'Cures (This Month)', value: curedAccounts.length.toLocaleString(), trend: '+8%', up: true },
                { label: 'Net Portfolio Movement', value: '+42', trend: 'Positive', up: true }
            ],
            performance: {
                kpis: [
                    { label: 'Portfolio Value', value: `$${(totalPortfolioValue / 1e9).toFixed(2)}B`, trend: '+4.2%', up: true },
                    { label: 'Avg Loan Size', value: `$${(avgLoanSize / 1e3).toFixed(0)}K`, trend: '+1.5%', up: true },
                    { label: 'Weighted Credit Score', value: avgCreditScore, trend: '-2 pts', up: false },
                    { label: 'Delinquency (by Value)', value: `${portfolioDelinqRate}%`, trend: '+0.3%', up: false },
                    { label: 'High Risk Exposure', value: `${highRiskExposure}%`, trend: '-0.1%', up: true },
                    { label: 'Proj. Loss Reserve', value: `$${(totalPortfolioValue * 0.012 / 1e6).toFixed(1)}M`, trend: '+5.4%', up: false },
                    { label: 'Loan Apps (Monthly)', value: '1,240', trend: '+180', up: true },
                    { label: 'Approval Rate', value: '62%', trend: '-2%', up: false }
                ],
                delinquencyTrend,
                statusDistribution,
                valueVsRisk,
                scoreBuckets,
                riskSegments
            },
            segmentation: {
                kpis: [
                    { label: 'Weighted Risk Score', value: '72/100', trend: '+2', up: false },
                    { label: 'Geo Variance', value: '14%', trend: 'Stable', up: null },
                    { label: 'Highest Risk Region', value: 'West', trend: '+1.2%', up: false },
                    { label: 'Vintage Default', value: '2.4%', trend: '-0.3%', up: true },
                    { label: 'Net Credit Margin', value: '3.8%', trend: '+0.1%', up: true },
                    { label: 'Risk Concentration', value: '18%', trend: '+0.5%', up: false },
                    { label: 'Outreach Targets', value: '450', trend: '+42', up: false }
                ],
                geoDelinquency,
                scoreVsDelinquency,
                loanAgeVsRisk,
                vintageHeatmap,
                segmentContribution
            },
            forecasting: {
                kpis: [
                    { label: 'Proj. Delinquency', value: '8.2%', trend: '+0.4%', up: false },
                    { label: 'Early Warnings', value: '482', trend: '+12', up: false },
                    { label: 'Transition Rate', value: '4.5%', trend: '+0.2%', up: false },
                    { label: 'ECL Provision', value: '$12.4M', trend: '+$1.2M', up: false },
                    { label: 'Risk Velocity', value: 'High', trend: 'Increasing', up: false },
                    { label: 'Expected Cures', value: '142', trend: '-8', up: false },
                    { label: 'Reserve Adequacy', value: '112%', trend: 'Stable', up: true }
                ],
                delinquencyForecast: [
                    ...delinquencyTrend.map(d => ({ ...d, type: 'Historical' })),
                    { month: '2026-01', rate: (delinquencyTrend[delinquencyTrend.length - 1].rate + 0.2).toFixed(1), type: 'Projected' },
                    { month: '2026-02', rate: (delinquencyTrend[delinquencyTrend.length - 1].rate + 0.5).toFixed(1), type: 'Projected' },
                    { month: '2026-03', rate: (delinquencyTrend[delinquencyTrend.length - 1].rate + 0.3).toFixed(1), type: 'Projected' }
                ],
                transitionMatrix: [
                    { from: 'Current', to: 'Current', value: 94.2 },
                    { from: 'Current', to: '30-60', value: 4.5 },
                    { from: 'Current', to: '60-90', value: 0.8 },
                    { from: 'Current', to: '90+', value: 0.5 },
                    { from: '30-60', to: 'Current', value: 42.1 },
                    { from: '30-60', to: '30-60', value: 38.5 },
                    { from: '30-60', to: '60-90', value: 15.4 },
                    { from: '30-60', to: '90+', value: 4.0 },
                    { from: '60-90', to: 'Current', value: 12.5 },
                    { from: '60-90', to: '60-90', value: 45.2 },
                    { from: '60-90', to: '90+', value: 42.3 }
                ],
                earlyWarningSignals: [
                    { signal: 'Multiple Inquiries', count: 450, impact: 'High' },
                    { signal: 'Payment Variance', count: 820, impact: 'Medium' },
                    { signal: 'Limit Utilization', count: 310, impact: 'High' },
                    { signal: 'Non-Loan Miss', count: 180, impact: 'Critical' },
                    { signal: 'Employment Update', count: 65, impact: 'Low' }
                ],
                riskFunnelData: [
                    { stage: 'High Risk Filter', value: 12500, label: 'Portfolio Filter' },
                    { stage: 'Early Warning', value: 4200, label: 'Behavioral Alert' },
                    { stage: 'Pre-Delinquent', value: 1800, label: '1-15 Day Past Due' },
                    { stage: 'Serious Risk', value: 650, label: '30+ Day Transition' }
                ],
                riskScoreBuckets: [
                    { bucket: '0-20', count: 85, name: 'Very Low' },
                    { bucket: '21-40', count: 1420, name: 'Low' },
                    { bucket: '41-60', count: 3200, name: 'Medium' },
                    { bucket: '61-80', count: 1850, name: 'High' },
                    { bucket: '81-100', count: 420, name: 'Critical' }
                ],
                decisionInsights: [
                    { id: 1, type: 'critical', message: 'Liquidity risk spike detected in West region segments.', impact: 'High' },
                    { id: 2, type: 'warning', message: 'Early stage delinquency rising in credit scores < 620.', impact: 'Medium' },
                    { id: 3, type: 'info', message: 'Forecasted recovery rates improved by 2.4% for Q1.', impact: 'Low' }
                ]
            },
            diagnostics: {
                migratedRate,
                migratedDelinqRate,
                nonMigratedDelinqRate,
                scatterData: associatesWithStats.map(a => ({ x: a.workload, y: parseFloat(a.delinqRate), name: a.name })),
                kpis: [
                    { label: 'Total Migrated', value: migratedAccounts.length.toLocaleString(), trend: '+5.4%', up: false },
                    { label: 'Migration Rate', value: `${migratedRate}%`, trend: '+1.5%', up: false },
                    { label: 'Delinq (Migrated)', value: `${migratedDelinqRate}%`, trend: '+2.1%', up: false },
                    { label: 'Delinq (Non-Mig.)', value: `${nonMigratedDelinqRate}%`, trend: '-0.4%', up: true },
                    { label: 'Avg Stabilization', value: '18 Days', trend: '-2 Days', up: true },
                    { label: 'Re-migration Risk', value: '4.2%', trend: '+0.5%', up: false },
                    { label: 'Efficiency Variance', value: `${(migratedDelinqRate - nonMigratedDelinqRate).toFixed(1)}%`, trend: 'Alert', up: false }
                ],
                volumeTrend: [
                    { month: 'Jul', volume: 420 },
                    { month: 'Aug', volume: 380 },
                    { month: 'Sep', volume: 510 },
                    { month: 'Oct', volume: 460 },
                    { month: 'Nov', volume: 620 },
                    { month: 'Dec', volume: 580 }
                ],
                groupedComparison: [
                    { status: 'Current', Migrated: 65, 'Non-Migrated': 82 },
                    { status: '30-60 Days', Migrated: 22, 'Non-Migrated': 12 },
                    { status: '60-90 Days', Migrated: 8, 'Non-Migrated': 4 },
                    { status: '90+ Days', Migrated: 5, 'Non-Migrated': 2 }
                ],
                outcomeBreakdown: [
                    { outcome: 'Cured', value: 450, fill: 'var(--success)' },
                    { outcome: 'Stayed Delinquent', value: 320, fill: 'var(--warning)' },
                    { outcome: 'Deteriorated', value: 180, fill: 'var(--danger)' },
                    { outcome: 'Other/Closed', value: 50, fill: 'var(--text-muted)' }
                ],
                stabilizationMatrix: migratedAccounts.slice(0, 50).map((a, i) => ({
                    x: Math.floor(Math.random() * 60), // Days since migration
                    y: a.days_delinquent, // Current Delinquency
                    z: Math.floor(Math.random() * 100), // Account Balance (proxy)
                    name: `Acc-${a.account_id}`
                })),
                deteriorationFlow: [
                    { from: 'Current', to: '30-60', value: 450 },
                    { from: '30-60', to: '60-90', value: 180 },
                    { from: '60-90', to: '90+', value: 85 },
                    { from: '90+', to: 'Legal', value: 42 }
                ]
            },
            lossMitigation: {
                kpis: mitigationKpis,
                programDistribution,
                volumeTrend,
                statusBreakdown,
                durationDistribution
            },
            effectiveness: {
                kpis: [
                    { label: 'Overall Cure Rate', value: '68%', trend: '+4.2%', up: true },
                    { label: 'Overall Re-default', value: '12.4%', trend: '-1.5%', up: true },
                    { label: 'Avg Cure Time', value: '45 Days', trend: '-2 Days', up: true },
                    { label: 'Program ROI', value: '8.4x', trend: '+0.2x', up: true },
                    { label: 'Self-Cure Rate', value: '18%', trend: '-2.1%', up: false },
                    { label: 'Success Variance', value: '5.2%', trend: 'Stable', up: null },
                    { label: 'Efficiency Score', value: '94/100', trend: '+2', up: true }
                ],
                cureRateByProgram: [
                    { program: 'Mod', rate: 72 },
                    { program: 'Forbearance', rate: 58 },
                    { program: 'Deferral', rate: 84 },
                    { program: 'Short Sale', rate: 42 }
                ],
                reDefaultRateByProgram: [
                    { program: 'Mod', rate: 8 },
                    { program: 'Forbearance', rate: 15 },
                    { program: 'Deferral', rate: 6 },
                    { program: 'Short Sale', rate: 22 }
                ],
                outcomeFunnel: [
                    { stage: 'Approved', count: 1000 },
                    { stage: 'Trial Start', count: 850 },
                    { stage: 'Trial Success', count: 720 },
                    { stage: 'Permanent Mod', count: 680 }
                ],
                riskVsOutcome: [
                    { x: 10, y: 90, name: 'Low Risk' },
                    { x: 30, y: 75, name: 'Med-Low' },
                    { x: 50, y: 60, name: 'Medium' },
                    { x: 70, y: 45, name: 'Med-High' },
                    { x: 90, y: 25, name: 'High Risk' }
                ],
                assistanceFrequency: [
                    { frequency: '1st Time', count: 820 },
                    { frequency: '2nd Time', count: 240 },
                    { frequency: '3+ Times', count: 85 }
                ],
                performanceHeatmap: [
                    { program: 'Mod', segment: 'Low LTV', score: 92 },
                    { program: 'Mod', segment: 'High LTV', score: 78 },
                    { program: 'Deferral', segment: 'Low LTV', score: 88 },
                    { program: 'Deferral', segment: 'High LTV', score: 82 },
                    { program: 'Forbearance', segment: 'Low LTV', score: 75 },
                    { program: 'Forbearance', segment: 'High LTV', score: 62 }
                ]
            },
            coaching: {
                kpis: [
                    { label: 'Early -> 90+ Conv.', value: '14.2%', trend: '-2.1%', up: true },
                    { label: 'Avg Time-to-Cure', value: '42 Days', trend: '-3 Days', up: true },
                    { label: 'Coaching Pipeline', value: '14', trend: '+2', up: false },
                    { label: 'Team Quality Score', value: '88/100', trend: '+4', up: true },
                    { label: 'Escalation Speed', value: '4.2h', trend: '-0.5h', up: true },
                    { label: 'Resolution Rate', value: '92%', trend: '+1.5%', up: true },
                    { label: 'Compliance Score', value: '98%', trend: 'Stable', up: null },
                    { label: 'Training Impact', value: '+12%', trend: 'Positive', up: true }
                ],
                riskHeatmap: associates.slice(0, 10).map(a => ({
                    name: a.associate_name,
                    Speed: Math.floor(Math.random() * 40) + 60,
                    Quality: Math.floor(Math.random() * 30) + 70,
                    Consistency: Math.floor(Math.random() * 40) + 50,
                    Compliance: Math.floor(Math.random() * 10) + 90
                })),
                priorityMatrix: associates.map(a => {
                    const accs = accounts.filter(acc => acc.associate_id === a.associate_id);
                    const delinq = accs.filter(acc => acc.days_delinquent > 0).length;
                    const rate = accs.length > 0 ? (delinq / accs.length) * 100 : 0;
                    const cures = accs.filter(acc => acc.cured_flag === 1).length;
                    const cureRate = accs.length > 0 ? (cures / accs.length) * 100 : 0;

                    return {
                        x: parseFloat(rate.toFixed(1)), // Risk (Delinquency Rate)
                        y: parseFloat(cureRate.toFixed(1)), // Performance (Cure Rate)
                        z: accs.length, // Workload
                        name: a.associate_name
                    };
                }),
                stageFunnel: [
                    { stage: '1-15 Days', count: accounts.filter(a => a.days_delinquent > 0 && a.days_delinquent <= 15).length },
                    { stage: '16-30 Days', count: accounts.filter(a => a.days_delinquent > 15 && a.days_delinquent <= 30).length },
                    { stage: '31-60 Days', count: accounts.filter(a => a.days_delinquent > 30 && a.days_delinquent <= 60).length },
                    { stage: '61-90 Days', count: accounts.filter(a => a.days_delinquent > 60 && a.days_delinquent <= 90).length },
                    { stage: '90+ Days', count: accounts.filter(a => a.days_delinquent > 90).length }
                ],
                timeToCureDist: [
                    { range: '0-15d', count: 420 },
                    { range: '16-30d', count: 850 },
                    { range: '31-45d', count: 1240 },
                    { range: '46-60d', count: 620 },
                    { range: '60d+', count: 310 }
                ],
                repeatDelinquency: [
                    { category: '1st Time', Migrated: 450, Stable: 820 },
                    { category: '2nd Time', Migrated: 310, Stable: 240 },
                    { category: '3+ Times', Migrated: 180, Stable: 95 }
                ],
                suggestedActions: [
                    { id: 1, associate: 'Associate 04', risk: 'Critical', action: 'Schedule 1-on-1 for Workload Stress', impact: '+15% Cure Rate' },
                    { id: 2, associate: 'Associate 12', risk: 'Warning', action: 'Assign "Warm Handoff" Training', impact: '-10% Migration Churn' },
                    { id: 3, associate: 'Associate 07', risk: 'High', action: 'Re-allocate 50 accounts to South Team', impact: 'Burnout Mitigation' },
                    { id: 4, associate: 'Associate 15', risk: 'Stable', action: 'Approve for Advanced Compliance Lead', impact: 'Team Quality Boost' }
                ]
            },
            strategy: {
                kpis: [
                    { label: 'Strategy Effectiveness', value: '84%', trend: '+4.5%', up: true },
                    { label: 'Opt-in Rate', value: '62%', trend: '+1.5%', up: true },
                    { label: 'Simulation Stability', value: 'High', trend: 'Stable', up: null },
                    { label: 'Proj. Recovery', value: '$12.8M', trend: '+$1.4M', up: true },
                    { label: 'Policy Adherence', value: '96%', trend: '+0.5%', up: true },
                    { label: 'Net Strategy ROI', value: '5.2x', trend: '+0.4x', up: true },
                    { label: 'Warning Sign Count', value: '12', trend: '-2', up: true }
                ],
                usageOutcomeTrend: [
                    { month: 'Jul', usage: 45, outcome: 38 },
                    { month: 'Aug', usage: 52, outcome: 42 },
                    { month: 'Sep', usage: 48, outcome: 45 },
                    { month: 'Oct', usage: 61, outcome: 54 },
                    { month: 'Nov', usage: 55, outcome: 50 },
                    { month: 'Dec', usage: 72, outcome: 68 }
                ],
                stressTestData: [
                    { scenario: 'Baseline', coverage: 85, impact: 12 },
                    { scenario: 'Stress 1', coverage: 70, impact: 25 },
                    { scenario: 'Stress 2', coverage: 55, impact: 42 },
                    { scenario: 'Aggressive', coverage: 95, impact: 8 }
                ],
                customerFlow: [
                    { from: 'Identification', to: 'Outreach', value: 1200 },
                    { from: 'Outreach', to: 'Application', value: 850 },
                    { from: 'Application', to: 'Approval', value: 620 },
                    { from: 'Approval', to: 'Trial Success', value: 580 }
                ],
                policyMatrix: [
                    { x: 20, y: 80, name: 'Standard Mod', z: 400 },
                    { x: 40, y: 70, name: 'Forbearance A', z: 250 },
                    { x: 60, y: 40, name: 'Short Sale Beta', z: 120 },
                    { x: 10, y: 90, name: 'Deferral Ext', z: 300 },
                    { x: 80, y: 20, name: 'Risk High B', z: 80 }
                ],
                roiAnalysis: [
                    { program: 'Loan Mod', cost: 1200, return: 8500 },
                    { program: 'Forbearance', cost: 800, return: 4200 },
                    { program: 'Deferral', cost: 500, return: 4800 },
                    { program: 'Short Sale', cost: 2500, return: 3100 }
                ],
                recommendations: [
                    { id: 1, policy: 'Extended Deferral', impact: 'High', feasibility: '92%', action: 'Deploy to West Region' },
                    { id: 2, policy: 'Interest Rate Cap', impact: 'Medium', feasibility: '85%', action: 'A/B Test in North' },
                    { id: 3, policy: 'Auto-Forbearance', impact: 'Critical', feasibility: '60%', action: 'Review Compliance' },
                    { id: 4, policy: 'Handoff Acceleration', impact: 'High', feasibility: '95%', action: 'Update Workflow' }
                ]
            }
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
};
