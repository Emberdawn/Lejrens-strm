(() => {
	const parseJson = (value) => {
		if (!value) {
			return [];
		}
		try {
			return JSON.parse(value);
		} catch (error) {
			return [];
		}
	};

	const renderLineChart = (config) => {
		const { canvasId, series, legend, labels, valueLabelSeriesIndexes } = config;
		const canvas = document.getElementById(canvasId);
		if (!canvas || !canvas.getContext) {
			return;
		}

		const ctx = canvas.getContext('2d');
		const width = canvas.width;
		const height = canvas.height;
		ctx.clearRect(0, 0, width, height);

		const padding = { top: 30, right: 90, bottom: 40, left: 60 };
		const chartWidth = width - padding.left - padding.right;
		const chartHeight = height - padding.top - padding.bottom;
		const allValues = series.reduce((values, entry) => values.concat(entry.data), []);
		const minValue = Math.min(0, ...allValues);
		const maxValue = Math.max(0, ...allValues);
		const valueRange = Math.max(1, maxValue - minValue);

		ctx.strokeStyle = '#ccd0d4';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(padding.left, padding.top);
		ctx.lineTo(padding.left, height - padding.bottom);
		ctx.lineTo(width - padding.right, height - padding.bottom);
		ctx.lineTo(width - padding.right, padding.top);
		ctx.stroke();

		ctx.fillStyle = '#1d2327';
		ctx.font = '12px Arial, sans-serif';
		const yTicks = 5;
		for (let i = 0; i <= yTicks; i += 1) {
			const value = minValue + (valueRange / yTicks) * i;
			const y = height - padding.bottom - (chartHeight / yTicks) * i;
			const label = `${Math.round(value).toLocaleString('da-DK', { maximumFractionDigits: 0 })} kr.`;
			ctx.fillText(label, 8, y + 4);
			ctx.strokeStyle = '#f0f0f1';
			ctx.beginPath();
			ctx.moveTo(padding.left, y);
			ctx.lineTo(width - padding.right, y);
			ctx.stroke();
		}

		const labelCount = labels.length || 1;
		const labelStep = labelCount > 1 ? chartWidth / (labelCount - 1) : 0;
		const getX = (index) => padding.left + labelStep * index;
		const getY = (value) => height - padding.bottom - ((value - minValue) / valueRange) * chartHeight;

		const drawLine = (seriesData, color) => {
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			ctx.beginPath();
			seriesData.forEach((value, index) => {
				const x = getX(index);
				const y = getY(value);
				if (index === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			});
			ctx.stroke();

			ctx.fillStyle = color;
			seriesData.forEach((value, index) => {
				const x = getX(index);
				const y = getY(value);
				ctx.beginPath();
				ctx.arc(x, y, 3, 0, Math.PI * 2);
				ctx.fill();
			});
		};

		series.forEach((entry) => {
			drawLine(entry.data, entry.color);
		});

		if (Array.isArray(valueLabelSeriesIndexes) && valueLabelSeriesIndexes.length) {
			ctx.font = '11px Arial, sans-serif';
			valueLabelSeriesIndexes.forEach((seriesIndex) => {
				const labelSeries = series[seriesIndex];
				if (!labelSeries) {
					return;
				}
				ctx.fillStyle = labelSeries.color;
				labelSeries.data.forEach((value, index) => {
					if (!value) {
						return;
					}
					const x = getX(index);
					const y = getY(value) - 6;
					const label = `${Math.round(value).toLocaleString('da-DK', { maximumFractionDigits: 0 })} kr.`;
					ctx.fillText(label, x + 6, y);
				});
			});
			ctx.font = '12px Arial, sans-serif';
		}

		ctx.fillStyle = '#1d2327';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		const labelInterval = labelCount > 1 ? Math.max(1, Math.ceil(50 / labelStep)) : 1;
		labels.forEach((label, index) => {
			if (index % labelInterval !== 0) {
				return;
			}
			const x = getX(index);
			ctx.fillText(label, x, height - padding.bottom + 12);
		});
		ctx.textAlign = 'start';
		ctx.textBaseline = 'alphabetic';

		ctx.lineWidth = 0;
		const legendY = padding.top - 8;
		const legendGap = 16;
		const legendBoxSize = 12;
		const legendBoxOffset = legendBoxSize + 6;
		let legendX = padding.left;
		legend.forEach((entry, index) => {
			if (index > 0) {
				legendX += legendGap;
			}
			ctx.fillStyle = entry.color;
			ctx.fillRect(legendX, padding.top - 18, legendBoxSize, legendBoxSize);
			ctx.fillStyle = '#1d2327';
			ctx.fillText(entry.label, legendX + legendBoxOffset, legendY);
			legendX += legendBoxOffset + ctx.measureText(entry.label).width;
		});
	};

	document.querySelectorAll('.sr-graph-data').forEach((element) => {
		const balanceData = parseJson(element.dataset.balance);
		const totalCostData = parseJson(element.dataset.totalCost);
		const totalPaymentsData = parseJson(element.dataset.totalPayments);
		const labels = parseJson(element.dataset.labels);
		const balanceCanvasId = element.dataset.balanceCanvas;
		const totalCanvasId = element.dataset.totalCanvas;

		if (!balanceCanvasId || !totalCanvasId) {
			return;
		}

		renderLineChart({
			canvasId: balanceCanvasId,
			series: [
				{ data: balanceData, color: '#d63638' },
			],
			legend: [
				{ label: 'Saldo (kr.)', color: '#d63638' },
			],
			labels,
			valueLabelSeriesIndexes: [0],
		});

		renderLineChart({
			canvasId: totalCanvasId,
			series: [
				{ data: totalCostData, color: '#00a32a' },
				{ data: totalPaymentsData, color: '#2271b1' },
			],
			legend: [
				{ label: 'Totalt forbrug (kr.)', color: '#00a32a' },
				{ label: 'Totalt indbetalt (kr.)', color: '#2271b1' },
			],
			labels,
			valueLabelSeriesIndexes: [0, 1],
		});
	});

	document.querySelectorAll('form.sr-graph-form--auto-submit').forEach((form) => {
		form.querySelectorAll('select').forEach((select) => {
			select.addEventListener('change', () => {
				form.submit();
			});
		});
	});
})();
