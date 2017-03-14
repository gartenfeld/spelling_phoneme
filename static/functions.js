d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() {  
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    });
};

function d3_make_bipartite_graph(tsv_file, properties) {
	d3.tsv(tsv_file, d3_draw_chart_with_words(properties));
};

function d3_draw_chart_with_words(properties) {
	return function (data) {

		function prepare_data (data) {
			
			if (properties.spellings_order) {
				var list_of_spellings = properties.spellings_order.split(", ");
			}
			
			else {
				var list_of_spellings = [];
			}
			
			if (properties.phonemes_order) {
				var list_of_phonemes = properties.phonemes_order.split(" ")
			}
			
			else {
				var list_of_phonemes = [];
			}
			
			var list_of_links = data;
			for (var i = 0; i < data.length; i++) {
				if (list_of_spellings.indexOf(data[i].spelling) < 0) {
					list_of_spellings.push(data[i].spelling);
				};
				if (list_of_phonemes.indexOf(data[i].phoneme) < 0) {
					list_of_phonemes.push(data[i].phoneme);
				};
			};

			//this bit sorts the list of links by the order in which the phonemes are listed
			//the if statement is to give me a way to stop it breaking if I haven't yet added the example words - just don't pass in the optional parameters
			if (properties.spellings_order || properties.phonemes_order) {
				list_of_links.sort(function (a, b) {
					return list_of_spellings.indexOf(a.spelling) - list_of_spellings.indexOf(b.spelling);
			})
			}
			
			var map_of_spelling_links = list_of_links.map(function (e) { return e.spelling; });
			var map_of_phoneme_links = list_of_links.map(function (e) { return e.phoneme; });
			
			//this bit sorts the phoneme list so that the phonemes are ordered by their first appearance in the list of links
			list_of_phonemes.sort(function (a, b) {
				var phoneme_index_in_links = map_of_phoneme_links.indexOf(a);
				var associated_spelling = list_of_links[phoneme_index_in_links].spelling;
				var associated_spellings_index_a = map_of_spelling_links.indexOf(associated_spelling);
				var phoneme_index_in_links = map_of_phoneme_links.indexOf(b);
				var associated_spelling = list_of_links[phoneme_index_in_links].spelling;
				var associated_spellings_index_b = map_of_spelling_links.indexOf(associated_spelling);
				return associated_spellings_index_a - associated_spellings_index_b;
			})

			var list_of_lists = [];
			list_of_lists.push(list_of_spellings);
			list_of_lists.push(list_of_phonemes);
			list_of_lists.push(list_of_links);
			return list_of_lists;

		};

		var list_of_lists = prepare_data(data);
		var [list_of_spellings, list_of_phonemes, list_of_links] = list_of_lists;

		var v_spacing = 25,
			v_margin = 50,
			h_spacing = 120,
			h_l_margin = 58,
			h_r_margin = 300,
			label_x_position = 230;

		var max_no_of_bullets = Math.max(list_of_spellings.length, list_of_phonemes.length),
			height = (max_no_of_bullets - 1)*v_spacing + v_margin*2 + 5,
			width = h_spacing + h_l_margin + h_r_margin;

		if (list_of_spellings.length > 1) {
			var left_v_spacing = (v_spacing * (max_no_of_bullets - 1)) / (list_of_spellings.length - 1);
		}
		else {
			var left_v_spacing = (v_spacing * (max_no_of_bullets - 1)) / (list_of_spellings.length);
		}
		if (list_of_phonemes.length > 1) {
			var right_v_spacing = (v_spacing * (max_no_of_bullets - 1)) / (list_of_phonemes.length - 1);
		}
		else {
			var right_v_spacing = (v_spacing * (max_no_of_bullets - 1)) / (list_of_phonemes.length);
		}

		function get_phoneme_y(phoneme) {
			return list_of_phonemes.indexOf(phoneme)*right_v_spacing + v_margin;			
		}

		function get_phoneme_y_for_text(phoneme) {
			return get_phoneme_y(phoneme) + 5;
		}

		function get_spelling_y(spelling) {
			return list_of_spellings.indexOf(spelling)*left_v_spacing + v_margin;
		}

		function get_spelling_y_for_text(spelling) {
			return get_spelling_y(spelling) + 5;
		}

		function check_if_link(spelling, phoneme) {
			for (var i = 0; i < list_of_links.length; i++) {
				if (list_of_links[i].spelling == spelling && list_of_links[i].phoneme == phoneme) {
					return true;
				}
			}
			return false;
		}

		var container = "body";
		if (properties.container_id) {container = "#"+properties.container_id;}

		var svgContainer = d3.select(container)
						.append("svg")
						.attr("width", width)
						.attr("height", height);

		svgContainer.append("g").attr("id", "link_group");
		svgContainer.append("g").attr("id", "node_group");

		var node_group = svgContainer.select("#node_group");
		var link_group = svgContainer.select("#link_group");

		var title = svgContainer.append("text")
						.classed("title", true)
						.attr("x", h_l_margin + h_spacing / 2)
						.attr("y", 25)
						.attr("text-anchor", "middle")
						.text(properties.title);

		var left_text = node_group.selectAll("text.spellings")
						.data(list_of_spellings)
						.enter()
						.append("text")
						.attr("x", h_l_margin - 5)
						.attr("y", function (d, i) { return i*left_v_spacing + v_margin + 5; })
						.attr("text-anchor", "end")
						.attr("opacity", 1e-6)
						.text( function (d) { return d });

		var right_text = node_group.selectAll("text.phonemes")
						.data(list_of_phonemes)
						.enter()
						.append("text")
						.attr("x", h_l_margin + h_spacing + 5)
						.attr("y", function (d, i) { return i*right_v_spacing + v_margin + 5; })
						.attr("text-anchor", "start")
						.attr("opacity", 1e-6)
						.text( function (d) { return "/" + d + "/" });

		var links = link_group.selectAll("line")
						.data(list_of_links)
						.enter()
						.append("line")
		            	.attr("x1", h_l_margin)
		            	.attr("y1", function (d) {return get_spelling_y(d.spelling);})
		            	.attr("x2", h_l_margin + h_spacing)
		            	.attr("y2", function (d) {return get_phoneme_y(d.phoneme);})
		            	.attr("opacity", 1e-6);

		function set_text_transitions(text_selection) {
			text_selection.transition()
							.duration(1000)
							.attr("opacity", 1);
		}

		set_text_transitions(left_text);
		set_text_transitions(right_text);
		links.transition()
			 .duration(1000)
			 .delay(function (d, i) { return 1000 + i*75; })
			 .attr("opacity", 1);

		if (properties.example) {
			
		}

		else {

			function clear_classes() {
				links.classed({"deactivated": false, "active": false});
				left_text.classed({"deactivated": false, "active": false});
				right_text.classed({"deactivated": false, "active": false});
				svgContainer.selectAll("text.example_words")
					.remove();
			}

			links.on("mouseover", function (d, i) {
				left_text.classed("deactivated", function (d2, i2) {return !(d2 == d.spelling);});
				left_text.classed("active", function (d2, i2) {return (d2 == d.spelling);});
				right_text.classed("deactivated", function (d2, i2) {return !(d2 == d.phoneme);});
				right_text.classed("active", function (d2, i2) {return (d2 == d.phoneme);});

				d3.select(this).moveToFront();
				links.classed("deactivated", true);
				d3.select(this).classed({"deactivated": false, "active": true});

				svgContainer.append("text")
					.attr("x", label_x_position)
					.attr("y", get_phoneme_y_for_text(d.phoneme))
					.text("'" + d.word_s + "' - /" + d.word_p + "/ - " + d.word_tr)
					.classed("example_words", true);
			})

			right_text.on("mouseover", function (d, i) {
				links.classed("active", function (d2, i2) {
					return d == d2.phoneme;
				});
				links.classed("deactivated", function (d2, i2) {
					return !(d == d2.phoneme);
				});
				d3.selectAll(".active").moveToFront();

				left_text.classed("deactivated", function (d2, i2) {return !(check_if_link(d2, d));});
				left_text.classed("active", function (d2, i2) {return (check_if_link(d2, d));});
				right_text.classed("deactivated", function (d2, i2) {return !(d2 == d);});
				right_text.classed("active", function (d2, i2) {return (d2 == d);});

				for (var j = 0; j < list_of_links.length; j++) {
					if (d == list_of_links[j].phoneme) {
						svgContainer.append("text")
							.attr("x", label_x_position)
							.attr("y", get_spelling_y_for_text(list_of_links[j].spelling))
							.text("'" + list_of_links[j].word_s + "' - \n/" + list_of_links[j].word_p + "/ - " + list_of_links[j].word_tr)
							.classed("example_words", true);
					}
				}
			})

			left_text.on("mouseover", function (d, i) {
				links.classed("active", function (d2, i2) {
					return d == d2.spelling;
				});
				links.classed("deactivated", function (d2, i2) {
					return !(d == d2.spelling);
				});
				d3.selectAll(".active").moveToFront();

				left_text.classed("deactivated", function (d2, i2) {return !(d == d2);});
				left_text.classed("active", function (d2, i2) {return (d == d2);});
				right_text.classed("deactivated", function (d2, i2) {return !(check_if_link(d, d2));});
				right_text.classed("active", function (d2, i2) {return (check_if_link(d, d2));});

				var number_of_links_matched = 0;
				for (var j = 0; j < list_of_links.length; j++) {
					if (d == list_of_links[j].spelling) {
						svgContainer.append("text")
							.attr("x", label_x_position)
							.attr("y", get_phoneme_y_for_text(list_of_links[j].phoneme))
							.text("'" + list_of_links[j].word_s + "' - /" + list_of_links[j].word_p + "/ - " + list_of_links[j].word_tr)
							.classed("example_words", true);
					}
				}
			})

			links.on("mouseout", clear_classes);
			left_text.on("mouseout", clear_classes);
			right_text.on("mouseout", clear_classes);

		}
	};
};
















///Experiment making the bipartite graph using the inbuilt force layout diagram
function d3_make_bipartite_graph_as_force(tsv_file, properties) {
	d3.tsv(tsv_file, d3_draw_force(properties));
};

function d3_draw_force(properties) {
	return function (data) {

		var width = 800,
		height = 800;

		var left_column_x = 50,
			right_column_x = 150;

		function build_nodes_and_links(data) {
			var result = {nodes: [], links: []};
			var spellings_done = [];
			var phonemes_done = [];
			var node_values_done = [];
			for (var i = 0; i < data.length; i++) {
				if (spellings_done.indexOf(data[i].spelling) < 0) {
					result.nodes.push({node: data[i].spelling, group: "spelling"});
					spellings_done.push(data[i].spelling);
					node_values_done.push(data[i].spelling);
				};
				if (phonemes_done.indexOf(data[i].phoneme) < 0) {
					result.nodes.push({node: data[i].phoneme, group: "phoneme"});
					phonemes_done.push(data[i].phoneme);
					node_values_done.push(data[i].phoneme);
				};
				result.links.push({"source": node_values_done.indexOf(data[i].spelling),
									"target": node_values_done.indexOf(data[i].phoneme)});
			};
			return result;
		}

		data_for_force = build_nodes_and_links(data);
		console.log(data_for_force);

		var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("style", "outline: thin solid gray");

		svg.append("g").attr("id", "links");
		svg.append("g").attr("id", "nodes");

		var force = d3.layout.force()
			.size([width, height])
			.nodes(data_for_force.nodes)
			.links(data_for_force.links)
			.charge(-8000)
			.chargeDistance(50)
			.linkDistance(100)
			.on("tick", tick);

		function update() {

			links = svg.select("#links").selectAll(".link").data(data_for_force.links);

			links.enter()
				.append("line")
				.attr("class", "link")
				.style("stroke-width", 2);

			links.exit().remove();

			nodes = svg.select("#nodes").selectAll(".node").data(data_for_force.nodes);

			nodes.enter()
				.append("text")
				.call(force.drag)
				.attr("class", "node")	
				.text(function(d) {return d.node})
				.attr("fill", function(d) {if (d.group == "spelling") {return "red";}
										   else {return "blue";}
										})
				.attr("text-anchor", function(d) {if (d.group == "spelling") {return "end";}
										   else {return "beginning";}
										});

			nodes.exit().remove();

			force.start()
		};

		update();

		function tick() {

			left_extreme_left = left_column_x - properties.x_variance
			left_extreme_right = left_column_x + properties.x_variance
			right_extreme_left = right_column_x - properties.x_variance
			right_extreme_right = right_column_x + properties.x_variance

		    links
				.attr("x1", function(d) {
					if (d.source.x < left_extreme_left) {return left_extreme_left;}
					else if (d.source.x > left_extreme_right) {return left_extreme_right;}
					else {return d.source.x;}
				})
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) {
					if (d.target.x < right_extreme_left) {return right_extreme_left;}
					else if (d.target.x > right_extreme_right) {return right_extreme_right;}
					else {return d.target.x;}
				})
				.attr("y2", function(d) { return d.target.y; });

		    nodes
				.attr("x", function(d) {if (d.group == "spelling") {
											if (d.x < left_extreme_left) {return left_extreme_left;}
											else if (d.x > left_extreme_right) {return left_extreme_right;}
											else {return d.x;}
										}
										else {
											if (d.x < right_extreme_left) {return right_extreme_left;}
											else if (d.x > right_extreme_right) {return right_extreme_right;}
											else {return d.x;}
										}
										})
				.attr("y", function(d) { return d.y; });
		}
	};
}





























//this is the old function which takes a tsv with two fields - 'spelling' and 'list_of_phonemes'
function d3_draw_chart(language_name) {
	return function (data) {
		// this formats the data so that it is a list of objects
		// each object has the properties 'spelling' and 'phoneme_list'
		// 'spelling' is a string, 'phoneme_list' is a list of strings
		for (var i = 0; i < data.length; i++) {
			data[i].phoneme_list = data[i].phoneme_list.split(', ')
		};
		// creates:
		// list of all spellings as strings
		// list of all phonemes as strings
		// list of all links as objects with two properties: spelling and phoneme
		var list_of_spellings = [];
		var list_of_phonemes = [];
		var list_of_links = [];
		for (var i = 0; i < data.length; i++) {
			if (list_of_spellings.indexOf(data[i].spelling) < 0) {
				list_of_spellings.push(data[i].spelling);
			};
			for (var j = 0; j < data[i].phoneme_list.length; j++) {
				if (list_of_phonemes.indexOf(data[i].phoneme_list[j]) < 0) {
					list_of_phonemes.push(data[i].phoneme_list[j]);
				};
				var link = {};
				link.spelling = data[i].spelling;
				link.phoneme = data[i].phoneme_list[j];
				list_of_links.push(link);
			};
		};

//	A SET OF CONSOLE.LOG statements that print to the console for use with the graphviz command line tool for bipartite graph arrangement
// tool: dot -Tpng graph.txt -o graph.png (I last did this with the english_vowels_shortened dataset)
//		console.log(list_of_spellings.join(' '));
//		console.log(list_of_phonemes.join(' '));
/*		temp_list_of_links = [];
		for (var i = 0; i < list_of_links.length; i++) {
			temp_list_of_links.push('\t' + list_of_links[i].spelling + ' -- ' + list_of_links[i].phoneme + ';');
		};
		console.log(temp_list_of_links.join('\n'));
*/
		function sort_lists(list_of_spellings, list_of_phonemes, list_of_links) {

		}

		sort_lists(list_of_spellings, list_of_phonemes, list_of_links)

		var v_spacing = 25,
			v_margin = 50,
			h_spacing = 120,
			h_margin = 58;

		var max_no_of_bullets = Math.max(list_of_spellings.length, list_of_phonemes.length),
			height = (max_no_of_bullets - 1)*v_spacing + v_margin*2 + 5,
			width = h_spacing + h_margin*2 + 10;

		var left_v_spacing = (v_spacing * (max_no_of_bullets - 1)) / (list_of_spellings.length - 1),
			right_v_spacing = (v_spacing * (max_no_of_bullets - 1)) / (list_of_phonemes.length - 1);

		var svgContainer = d3.select("body")
						.append("svg")
//						.style("width", width)
						.attr("width", width)
						.attr("height", height);

		var title = svgContainer.append("text")
						.classed("title", true)
						.attr("x", width / 2)
						.attr("y", 25)
						.attr("text-anchor", "middle")
						.text(language_name);

		var left_bullets = svgContainer.selectAll("circle.left")
						.data(list_of_spellings)
						.enter()
						.append("circle")
						.attr("cx", h_margin)
						.attr("cy", function (d, i) { return i*left_v_spacing + v_margin; });

		var left_text = svgContainer.selectAll("text.spellings")
						.data(list_of_spellings)
						.enter()
						.append("text")
						.attr("x", h_margin - 5)
						.attr("y", function (d, i) { return i*left_v_spacing + v_margin + 5; })
						.attr("text-anchor", "end")
						.text( function (d) { return d });

		var right_bullets = svgContainer.selectAll("circle.phonemes")
						.data(list_of_phonemes)
						.enter()
						.append("circle")
						.attr("cx", h_spacing + h_margin)
						.attr("cy", function (d, i) { return i*right_v_spacing + v_margin; });

		var right_text = svgContainer.selectAll("text.phonemes")
						.data(list_of_phonemes)
						.enter()
						.append("text")
						.attr("x", h_margin + h_spacing + 5)
						.attr("y", function (d, i) { return i*right_v_spacing + v_margin + 5; })
						.attr("text-anchor", "start")
						.text( function (d) { return "/" + d + "/" });

		var links = svgContainer.selectAll("line")
						.data(list_of_links)
						.enter()
						.append("line")
		            	.attr("x1", h_margin)
		            	.attr("y1", function (d) {return list_of_spellings.indexOf(d.spelling)*left_v_spacing + v_margin;})
		            	.attr("x2", h_margin + h_spacing)
		            	.attr("y2", function (d) {return list_of_phonemes.indexOf(d.phoneme)*right_v_spacing + v_margin;});

		links.on("mouseover", function () {d3.select(this).classed("active", true);})
		links.on("mouseout", function () {d3.select(this).classed("active", false);})

		right_text.on("mouseover", function (d, i) {
			links.classed("active", function (d2, i2) {
				if (d == d2.phoneme) {return true;} else {return false;}
			});
		})

		right_text.on("mouseout", function () {
			links.classed("active", false);
		})

		left_text.on("mouseover", function (d, i) {
			links.classed("active", function (d2, i2) {
				if (d == d2.spelling) {return true;} else {return false;}
			});
		})

		left_text.on("mouseout", function () {
			links.classed("active", false);
		})

	};
		d3.tsv(tsv_file, d3_draw_chart_with_words(properties));
};