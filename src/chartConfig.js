export const CHART_CONFIG = {
    // Left margin of the chart container (distance from container edge to axis)
    marginLeft: 15,

    // Bottom margin (distance for X-axis labels)
    marginBottom: 5,

    // Right margin
    marginRight: 15,

    // Y-Axis Width (Area dedicated to Y-axis ticks/numbers)
    yAxisWidth: 35,

    // Y-Axis Label Settings
    yLabel: {
        position: 'insideLeft',
        offset: -5, // Increase this to move label RIGHT (closer to numbers), decrease to move LEFT
        angle: -90,
        fontSize: 10,
        style: { textAnchor: 'middle', fill: 'var(--text-muted)' }
    },

    // X-Axis Label Settings
    xLabel: {
        position: 'insideBottom',
        offset: 0, // Increase this to move label UP (closer to numbers), decrease to move DOWN
        fontSize: 10,
        style: { textAnchor: 'middle', fill: 'var(--text-muted)' }
    }
};
