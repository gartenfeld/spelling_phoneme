//d3.tsv("tsv_files/english_vowels.tsv", d3_draw_chart("English Vowels"));
//d3.tsv("tsv_files/english_vowels_shortened.tsv", d3_draw_chart("English V"))
//d3.tsv("tsv_files/english_vowels_shortened_no_unstressed.tsv", d3_draw_chart("English V - ɪ, ə"))

//d3_make_bipartite_graph_as_force("tsv_files/german.tsv", {x_variance: 0});
d3_make_bipartite_graph("/data/example1.tsv", {title: "'g'/'j' Example", container_id: "example_1"});
d3_make_bipartite_graph("/data/example2.tsv", {title: "'a' Example", container_id: "example_2"});
d3_make_bipartite_graph("/data/italian_vowels.tsv", {title: "Italian Vowels", container_id: "italian_vowels"});
d3_make_bipartite_graph("/data/polish_vowels.tsv", {title: "Polish Vowels", container_id: "polish_vowels"});
d3_make_bipartite_graph("/data/german.tsv", {title: "German Vowels", container_id: "german_vowels"});
d3_make_bipartite_graph("/data/english_vowels_shortened_sorted.tsv", {title: "English Vowels", container_id: "english_vowels", translations: false});
//d3.tsv("tsv_files/english_vowels_shortened_sorted.tsv", d3_draw_chart("English Vowels (Basic)"));

//d3.tsv("tsv_files/polish_consonants.tsv", d3_draw_chart_with_words({title: "Polish Consonants"}));
