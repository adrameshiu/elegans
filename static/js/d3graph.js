
// Setup
var includeY0 = false;
var includeX0 = false;
var margin = {top: 10, right: 40, bottom: 40, left: 30};
var width = 1000 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;

//-------------------------------------------------------------------
// Scatter plot with regression line
//-------------------------------------------------------------------
graphd3 = function(id, data) {

	neurons = data['neurons'];
	synapses = data['synapses'];
	//console.log(neurons.length, synapses.length)

	var padding = 1;
	var radius = 10;
	function collide(alpha) {
  		var quadtree = d3.geom.quadtree(neurons);
  		return function(d) {
    		var rb = 2*radius + padding,
			nx1 = d.x - rb,
			nx2 = d.x + rb,
			ny1 = d.y - rb,
			ny2 = d.y + rb;
			quadtree.visit(function(quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== d)) {
					var x = d.x - quad.point.x,
			    	y = d.y - quad.point.y,
			    	l = Math.sqrt(x * x + y * y);
			  		if (l < rb) {
						l = (l - rb) / l * alpha;
						d.x -= x *= l;
						d.y -= y *= l;
						quad.point.x += x;
						quad.point.y += y;
					}
				}
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			});
		};
	}

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(80)
        .size([width, height]);

    var svg = d3.select(id).append("svg")
        .attr("width", width)
        .attr("height", height);

	force.nodes(neurons).links(synapses).start();

	var link = svg.selectAll(".link")
		.data(synapses)
		.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) { return Math.sqrt(1*d.weight); })
		.style("stroke", "#000");

	var node = svg.selectAll(".node")
		.data(neurons)
		.enter().append("circle")
		.attr("class", "node")
		.attr("r", radius)
		.style("fill", function(d) { return color(d.type); })
		.style("stroke-width", "1px")
		.style("stroke", "#000")
		.call(force.drag);


    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

    	node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
    	node.each(collide(0.5));
	});
}


	