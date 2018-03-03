d3.select("svg").attr("width", window.screen.width*5)
                    .attr("height", window.screen.height*10);

    const overhead = ["index","x","y","vy","vx"];

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory10);



    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {return d.id;}))
        .force("charge", d3.forceManyBody().strength(-600))
        .force("center", d3.forceCenter(width/2, height/2));

    d3.json("twitter_users_graph2.json", function(error, graph){
    // d3.json("graphFile.json", function(error, graph){
        if (error) throw error;

        graph.links.forEach(function(d){
            d.source = d.source;
            d.target = d.target;
        });

        var link = svg.append("g")
            .style("stroke","#aaa")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line");




        var node = svg.append("g")
            .attr("class","nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", 1)
        // ;
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end",dragended));

        //
        var label = svg.append("g")
            .attr("class","labels")
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("class","label");
            // .text(function(d){return d.id;});


        svg.selectAll("circle")
            .on("mouseover", function(d){
                d3.select(this).style("r",100);

                const focus = svg.append('g')
                    .attr('class', 'focus');
                const cx = d3.select(this).attr("cx");
                const cy = d3.select(this).attr("cy");
                const nodeData = ["Name: "+d.name,
                    "Degree: "+d.degree,
                    "parity: "+d.parity,
                    "betweenness: "+d.betweenness,
                    "closeness_centrality: "+d.closeness_centrality,
                    "eigenvector_centrality: "+d.eigenvector_centrality];
                // const nodeData =    [d.name, d.id];
                focus.append('rect')
                    .attr('height', 300*5)
                    .attr('width', 300*6)
                    .attr("x", cx)
                    .attr("y", cy);
                var x = 0.0;
                for (var metric in d){
                    x += 1.2;
                    if (overhead.indexOf(metric)<0){
                        focus.append('text')
                            .attr('x', cx+10)
                            .attr('y', cy+10)
                            .attr('dy', x + 'em')
                            .attr('dx', '.5em')
                            .style("font-size", 80)
                            .text(metric +": "+d[metric]);
                    }
                }

                d3.select('.overlay')
                    .styles({
                        fill: 'none',
                        'pointer-events': 'all'
                    });

                d3.selectAll('.focus')
                    .style('opacity', 0.9);

                d3.selectAll('.focus rect')
                    .styles({
                        fill: '#CFEEF1',
                        stroke: 'black'
                    });
            })
            .on("mouseout",function(d){
                d3.select(this).style("r", function(d){return Math.max(d.degree/2,5);});
                d3.selectAll(".focus").remove();
            });


        simulation
            .nodes(graph.nodes)
            .on("tick",ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked(){
            link
                .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

            node
                .attr("r", function(d){return Math.max(d.degree/2,5);})
                .style("fill", function(d){return color(d.lang);})
                .style("stroke", "#969696")
                .style("stroke-width","1px")
                .attr('cx', d => d.x)
        .attr('cy', d => d.y);

            label
                .attr("x", function(d){return d.x;})
                .attr("y", function(d){return d.y;})
                .style("font-size", "10px")
                .style("fill","#4393c3")
                .text(function(d){return d.sehir_matches;})
        }


    });



    function dragstarted(d){
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d){
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
