function parallelcoordinates(id, cols, data, extents, tooltip, unites, sel_cb) {
	let div = d3.select(id)
		.html(null);
	let svg = div.append("svg")
		.style("width", "100%")
		.style("height", "100%")
	let x = null;
	let y = null;
	let ranges = extents;
	let selected = null;
	maj_svg();
	
	// fonction extérieure pour mettre à jour les points en surbrillance
	id.maj_couleurs = (r, s) => {
		ranges = r;
		selected = s;
		svg.selectAll(".line")
			.style("stroke", "lightgrey")
			.attr("stroke-opacity", .3)
			.filter(d => Object.entries(d).every(([c, v]) => c.startsWith("_") || v>=ranges[c][0] && v<=ranges[c][1]))
			.style("stroke", "dodgerblue")
			.filter(d => d._parent === s)
			.style("stroke", "orange")
			.attr("stroke-opacity", 1)
			.raise()
	};
	
	function maj_svg() {
		let {width, height} = svg.node().getBoundingClientRect();
		let margin = {top: 5, right: 30, bottom: 64, left: 60};
		x = d3.scalePoint(cols, [margin.left, width - margin.right]);
		y = Object.fromEntries(cols.map(c => [c, d3.scaleLinear(extents[c], [height - margin.bottom, margin.top])]))
		let line = d3.line()
			.x(([c]) => x(c))
			.y(([c, v]) => y[c](v))
		svg.html(null);
		svg.append("g")
			.attr("fill", "none")
			.attr("stroke-width", 1.5)
			.attr("stroke-opacity", .3)
			.selectAll("path")
			.data(data)
			.join("path")
			.attr("class", "line")
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
