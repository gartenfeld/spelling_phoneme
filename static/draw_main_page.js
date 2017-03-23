//d3.tsv("tsv_files/english_vowels.tsv", d3_draw_chart("English Vowels"));
//d3.tsv("tsv_files/english_vowels_shortened.tsv", d3_draw_chart("English V"))
//d3.tsv("tsv_files/english_vowels_shortened_no_unstressed.tsv", d3_draw_chart("English V - ɪ, ə"))

//d3_make_bipartite_graph_as_force("tsv_files/german.tsv", {x_variance: 0});
d3_make_bipartite_graph("/data/example1.tsv", {container_id: "example_1", no_translation: true});
d3_make_bipartite_graph("/data/example2.tsv", {container_id: "example_2", no_translation: true});
d3_make_bipartite_graph("/data/italian_vowels.tsv", {container_id: "italian_vowels"});
d3_make_bipartite_graph("/data/polish_vowels.tsv", {container_id: "polish_vowels"});
d3_make_bipartite_graph("/data/german.tsv", {container_id: "german_vowels"});
d3_make_bipartite_graph("/data/english_vowels_shortened_sorted.tsv", {container_id: "english_vowels", no_translation: true});
//d3.tsv("tsv_files/english_vowels_shortened_sorted.tsv", d3_draw_chart("English Vowels (Basic)"));

//d3.tsv("tsv_files/polish_consonants.tsv", d3_draw_chart_with_words({title: "Polish Consonants"}));
