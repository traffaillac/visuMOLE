function parallelcoordinates(id, cols, data, extents, tooltip, unites, sel_cb) {
	let div = d3.select(id)
		.html(null);
	let svg = div.append("svg")
		.style("width", "100%")
		.style("height", "100%")
	maj_svg();
	
	function maj_svg() {
		let {width, height} = svg.node().getBoundingClientRect();
		let margin = {top: 5, right: 30, bottom: 64, left: 60};
		let x = d3.scalePoint(cols, [margin.left, width - margin.right]);
		let y = Object.fromEntries(cols.map(c => [c, d3.scaleLinear(extents[c], [height - margin.bottom, margin.top])]))
		let line = d3.line()
			.x(([c]) => x(c))
			.y(([c, v]) => y[c](v))
		svg.html(null);
		svg.append("g")
			.attr("fill", "none")
			.attr("stroke-width", 1.5)
			.attr("stroke-opacity", .4)
			.selectAll("path")
			.data(data)
			.join("path")
			.attr("stroke", "dodgerblue")
			.attr("d", d => line(cols.map(c => [c, d[c]])))
		svg.append("g")
			.selectAll("g")
			.data(cols)
			.join("g")
			.attr("transform", d => `translate(${x(d)}, 0)`)
			.each(function(d) { d3.select(this).call(d3.axisLeft(y[d]).tickFormat(v => v.toMaxDigits(4))); })
			.call(g => g.selectAll("text")
				.clone(true).lower()
				.attr("fill", "none")
				.attr("stroke-width", 4)
				.attr("stroke-opacity", .7)
				.attr("stroke-linejoin", "round")
				.attr("stroke", "white"))
			.call(g => g.append("text")
				.attr("transform", `translate(0,${8+height-margin.bottom}),rotate(-45)`)
				.attr("text-anchor", "end")
				.attr("fill", "black")
				.text(d => d))
	}
}
