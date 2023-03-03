function scatterplot(id, cols, data, extents, i, j, tooltip) {
	// structure HTML avec sélecteurs d'axes
	let div = d3.select(id)
		.attr("class", "flexcolstretch")
		.html(null);
	let ord = div.append("select")
		.on("change", maj_svg)
		.style("align-self", "start")
	let svg = div.append("svg")
		.style("flex", "auto")
		.style("user-select", "none")
	let abs = div.append("select")
		.on("change", maj_svg)
		.style("align-self", "end")
		.style("text-align", "right")
	for (let sel of [abs, ord]) {
		let e = sel.append("optgroup").attr("label", "Entrées");
		let s = sel.append("optgroup").attr("label", "Sorties");
		for (let c of cols)
			(c.startsWith("om_")?s:e).append("option").text(c)
	}
	abs.property("value", i);
	ord.property("value", j);
	let x = null;
	let y = null;
	let ranges = extents;
	
	// fonction extérieure pour mettre à jour les points en surbrillance
	id.maj_ranges = (r) => {
		ranges = r;
		let rect = svg.select("rect");
		let [li, hi] = r[i], [Li, Hi] = extents[i];
		let [lj, hj] = r[j], [Lj, Hj] = extents[j];
		if (li === Li && hi === Hi && lj === Lj && hj === Hj) {
			rect.attr("display", "none");
		} else {
			rect.attr("x", x(li));
			rect.attr("y", y(hj));
			rect.attr("width", x(hi) - x(li));
			rect.attr("height", y(lj) - y(hj));
			rect.attr("display", null);
		}
		svg.selectAll("circle")
			.join("circle")
			.style("fill", "lightgrey")
			.filter(d => Object.entries(d).every(([c, v]) => c.startsWith("_") || v>=ranges[c][0] && v<=ranges[c][1]))
			.style("fill", null);
	};
	
	// visualisation scatterplot
	function maj_svg() {
		let {width, height} = svg.node().getBoundingClientRect();
		let margin = {top: 6, right: 30, bottom: 18, left: 60};
		i = abs.property("value");
		j = ord.property("value");
		x = d3.scaleLinear()
			.domain(extents[i]).nice()
			.range([margin.left, width - margin.right]);
		y = d3.scaleLinear()
			.domain(extents[j]).nice()
			.range([height - margin.bottom, margin.top]);
		svg.html(null);
		svg.append("g")
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x))
		svg.append("g")
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y))
		let points = svg.append("g")
			.selectAll("circle")
			.data(data)
			.join("circle")
			.attr("cx", d => x(d[i]))
			.attr("cy", d => y(d[j]))
			.attr("r", d => 1 + 2 * Math.sqrt(d._samples ? d._samples.length : 1))
			.on("mouseenter", e => {
				let bounds = e.target.getBoundingClientRect();
				tooltip.innerHTML = Object.entries(e.target.__data__).filter(([c, v]) => c !== "_parent").map(([c, v]) => `${c==="_samples"?"échantillons":c} : <b>${c==="_samples"?v.length:v.toFixed(2)}</b>`).join("<br>");
				tooltip.style.display = null;
				tooltip.style.left = bounds.left + "px";
				let height = tooltip.getBoundingClientRect().height;
				tooltip.style.top = Math.min(Math.max((bounds.top + bounds.bottom) / 2 - height / 2, 0), window.innerHeight - height) + "px";
			})
			.on("mouseout", e => {
				tooltip.style.display = "none"; })
		svg.append("rect")
			.attr("display", "none")
			.attr("fill", "none")
			.attr("stroke", "#000")
			.attr("stroke-dasharray", "5,5")
			.style("pointer-events", "none")
		id.maj_ranges(ranges);
	}
	maj_svg();
}
