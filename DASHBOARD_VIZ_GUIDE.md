# LoanPulse Dashboard: Visual Components Documentation

This document provide a detailed breakdown of all charts, graphs, and tables across the LoanPulse dashboard pages.

---

## Standardized Visualization Principles (New)
- **Axis Integrity**: Every chart includes explicit X and Y axis labels to ensure context is never lost.
- **Legend Usage**: Legends are mandatory for complex charts, detailing every data series and bubble/marker dimension.
- **Color Semantics**: 
  - **Red (`#ef4444`)**: Reserved strictly for high risk, deterioration, and critical alerts.
  - **Green (`#10b981`)**: Reserved strictly for recoveries, cures, and optimal performance.
  - **Indigo (`#6366f1`)**: Default color for general data series and bar graphs to avoid visual bias.

---

## Page 1A: Portfolio Overview

### 1. Associate Delinquency Comparison
- **Type**: Bar Chart
- **Description**: Comparative risk assessment showing delinquency rates across top associates.
- **X-Axis**: Associate Name
- **Y-Axis**: Delinquency (%)
- **Colors**: `var(--primary)` (Indigo)
- **Features**: Data labels on top, Legend included.

### 2. Associate Cure Rate
- **Type**: Bar Chart
- **Description**: Displays the recovery performance (cured accounts) for associates.
- **X-Axis**: Associate Name
- **Y-Axis**: Cure Rate (%)
- **Colors**: `var(--primary)` (Standardized to Indigo for general benchmarking)

### 3. Delinquency vs Cures Trend
- **Type**: Area Chart
- **Description**: Overlays delinquency volume against cure volume.
- **X-Axis**: Month
- **Y-Axis**: Volume
- **Colors**: 
  - **Delinquencies**: `var(--danger)` (Red - Signal for Risk)
  - **Cures**: `var(--accent)` (Green - Signal for Recovery)

### 4. Accounts per Associate
- **Type**: Bar Chart
- **Description**: Workload distribution.
- **X-Axis**: Associate Name
- **Y-Axis**: Accounts
- **Colors**: `var(--secondary)` (Grey/Slate)

---

## Page 1B: Operational Diagnostics

### 1. Migration Volume Trend
- **Type**: Bar Chart
- **X-Axis**: Month
- **Y-Axis**: Accounts
- **Colors**: `var(--primary)` (Indigo)

### 2. Migrated vs Non-Migrated Comparison
- **Type**: Grouped Bar Chart
- **Description**: Status distribution comparison.
- **X-Axis**: Delinquency Status
- **Colors**: 
  - **Migrated**: `var(--primary)` (Indigo)
  - **Non-Migrated**: `var(--secondary)` (Grey)
- **Rationale**: Neutral colors used as "migrated" is a status, not inherently a failure.

### 3. Migration Outcome Breakdown
- **Type**: Horizontal Bar Chart
- **Y-Axis**: Resolution Outcome
- **Colors**: Semantic (Cured=Green, Deteriorated=Red, Warning=Amber).

### 4. Workload vs Delinquency
- **Type**: Scatter Chart
- **X-Axis**: Accounts Managed
- **Y-Axis**: Delinquency Rate (%)
- **Colors**: Points turn Red if delinquency > 10% threshold.

### 5. Stabilization Matrix
- **Type**: Bubble Chart
- **X-Axis**: Days Since Migration
- **Y-Axis**: Delinquency Depth
- **Legend**: 
  - **Bubble Size**: Account Balance
  - **Color**: Green (Low Risk) vs Red (High Risk > 60 days).

---

## Page 1C: Coaching Insights

### 1. Delinquency Funnel
- **X-Axis**: Aging Days
- **Y-Axis**: Cases
- **Colors**: `var(--primary)`

### 2. Time-to-Cure Distribution
- **X-Axis**: Days to Cure
- **Y-Axis**: Resolution Volume
- **Colors**: `var(--primary)`

### 3. Repeat Delinquency Analysis
- **Type**: Grouped Bar Chart
- **Colors**: Migrated (Indigo), Stable (Grey).

### 4. Associate Risk Heatmap
- **Type**: Stacked Horizontal Bar Chart
- **Legend**: Color-coded segments for Speed, Quality, Consistency, and Compliance.
- **Colors**: Indigo gradient scale (Dark -> Light) to indicate contribution without "Red-for-low-score" confusion.

### 5. Coaching Priority Matrix
- **Type**: Scatter Chart with Quadrant Overlay
- **X-Axis**: Delinquency Risk
- **Y-Axis**: Cure Performance
- **Legend**: Optimal (Green), Coaching (Amber), Critical (Red).

---

## Page 2C: Risk Forecasting

### 1. Risk Transition Matrix
- **Type**: Dynamic Heatmap Grid
- **Logic**: 
  - **Green Tones**: Moving to a less severe bucket (Recovery).
  - **Red Tones**: Moving to a more severe bucket (Deterioration).
  - **Indigo Tones**: Staying in the same bucket (Stability).
- **Intensity**: Darker shades indicate higher probability (%).

---

## Page 3B: Assistance Effectiveness

### 1. Cure Rate by Program
- **Colors**: `var(--accent)` (Green - Positive metric).

### 2. Re-default Rate by Program
- **Colors**: `var(--primary)` (Indigo - Neutralized to avoid "all red" bar charts while monitoring negative outcomes).

### 3. Risk vs Outcome
- **Type**: Scatter Chart
- **X-Axis**: Pre-Program Risk
- **Y-Axis**: Resolution Success (%)
- **Legend**: Different colors for program cohorts.
