margin_scatter = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 40
},
  width_scatter = 800 - margin_scatter.left - margin_scatter.right,
  height_scatter = 631,92 - margin_scatter.top - margin_scatter.bottom,

  x_scatter = d3.scaleLinear().range([0, width_scatter]),
  y_scatter = d3.scaleLinear().range([height_scatter, 0]),


  xAxis_scatter = d3.axisBottom(x_scatter),
  yAxis_scatter = d3.axisLeft(y_scatter);


svg = d3.select("#scatterArea").append("svg")
  .attr("width", width_scatter + margin_scatter.left + margin_scatter.right)
  .attr("height", height_scatter + margin_scatter.top + margin_scatter.bottom)
  .attr("transform", "translate(" + 20 + "," + 0 + ")");

focus = svg.append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");

xAxis = focus.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height_scatter + ")")
  .call(xAxis_scatter);

yAxis = focus.append("g")
  .attr("class", "axis axis--y")
  .call(yAxis_scatter);

focus.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin_scatter.left)
  .attr("x", 0 - (height_scatter / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Y1");

svg.append("text")
  .attr("transform",
      "translate(" + ((width_scatter + margin_scatter.right + margin_scatter.left) / 2) + " ," +
      (height_scatter + margin_scatter.top + margin_scatter.bottom) + ")")
  .style("text-anchor", "middle")
  .text("Y2");


function drawScatter(data) {
    console.log(data)
    cValue = function (d) {
        console.log(d.Continent)
        return d.Continent;
    }

  color = d3.scaleOrdinal(d3.schemeCategory10);
  //Update the scale
  var maxHeight = d3.max(data, function (d) {
      return Math.abs(d.Y2)
  });
  var minHeight = d3.min(data, function (d) {
      return Math.abs(d.Y2)
  })
  y_scatter.domain([maxHeight + 0.5, -maxHeight - 0.5]); //show negative
  var maxWidth = d3.max(data, function (d) {
      return Math.abs(d.Y1)
  });
  var minWidth = d3.min(data, function (d) {
      return Math.abs(d.Y1)
  })
  x_scatter.domain([maxWidth + 0.5, -maxWidth - 4]); //show negative

  // Update axes
  xAxis_scatter.scale(x_scatter);
  xAxis.transition().call(xAxis_scatter);
  yAxis_scatter.scale(y_scatter);
  yAxis.transition().call(yAxis_scatter);

  focus.selectAll("circle").remove();

  dots = focus.selectAll("circle").data(data);

  dots.enter().append("circle")
      .attr("r", 3)
      .attr("class", "knncircle")
      .style("fill", function (d) {

              return color(cValue(d));

      })
      .attr("cx", function (d) {
          return x_scatter(d.Y1);
      })
      .attr("cy", function (d) {
          return y_scatter(d.Y2)
      })


  var legend = focus.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
          return "translate(0," + i * 17 + ")";
      });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width_scatter - 5)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", color)


  // draw legend text
  legend.append("text")
      .attr("x", width_scatter - 15)
      .attr("y", 6)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size", "0.8em")
      .text(function (d) {
          return d;
      })
      .on('click', function(d){
            var currentContinent = d
           update(currentContinent, fullDataSet)
      })
}

function update(currentContinent, dataset) {

      // Create new data with the selection?
      var dataFilter = dataset.filter(function(d){
          return d.Continent==currentContinent})

      // Give these new data to update line
      updateTableData(dataFilter)
}

////////////////////////// Brush initialization (scatter plot) /////////////////////////////////

brushTot = d3.brush()
    .extent([
        [0, 0],
        [width_scatter, height_scatter]
    ])
    .on("end", selected)

focus.append("g")
    .attr("class", "brushT")
    .call(brushTot);

///////////////////////selection function of brush (scatter plot) ///////////////////////////////




function selected() {
    dataSelection = []

    var selection = d3.event.selection;

    if (selection != null) {
        focus.selectAll("circle")
            .style("fill", function (d) {
                if (x_scatter(d.Y1) > selection[0][0] && x_scatter(d.Y1) < selection[1][0] &&
                    y_scatter(d.Y2) > selection[0][1] && y_scatter(d.Y2) < selection[1][1]) {

                    dataSelection.push(d);
                    return "green";

                } else {
                    return "red";
                }
            })
            focus.selectAll(".legend").remove();


       // g.selectAll("circle").remove();

        /*
            g.selectAll("circle")
                .data(dataSelection)
                .enter().append("circle", "image")
                .attr("r", 2)
                .style("fill", "red")
                .on("mousemove", showTooltip2)
                .on("mouseout", hideTooltip2)
                .attr("transform", function (d) {
                    return "translate(" + projection([
                        d.lon,
                        d.lat,
                    ]) + ")";
                })
        //} else {
            g.selectAll("circle")
                .data(dataSelection)
                .enter().append("circle", "image")
                .attr("r", 8 / k)
                .style("fill", "green")
                .on("mousemove", showTooltip2)
                .on("mouseout", hideTooltip2)

                .attr("transform", function (d) {

                    return "translate(" + projection([
                        d.lon,
                        d.lat,

                    ]) + ")";
                })
        /}*/
       // RadarChart(".radarChart", dataSelection, radarChartOptions);
        //lineChart(dataSelection);
      console.log(dataSelection)
      updateTableData(dataSelection)

      }
    //Nothing is selected by the brush
    else {
        dataSelection = [];

        focus.selectAll("circle")
            .style("fill", function (d) {
                return color(cValue(d));
            })

            updateTableData(fullDataSet)
            // put back the legend

            var legend = focus.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * 17 + ")";
                });

            // draw legend colored rectangles
            legend.append("rect")
                .attr("x", width_scatter - 5)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", color)


            // draw legend text
            legend.append("text")
                .attr("x", width_scatter - 15)
                .attr("y", 6)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .style("font-size", "0.8em")
                .text(function (d) {
                    return d;
                })
                .on('click', function(d){
                      var currentContinent = d
                     update(currentContinent, fullDataSet)
            })

        console.log("reset");

        if (flag_s == false) {
            datap = filtered_data;
        } else {
            datap = contained_points;
        }

        g.selectAll("circle").remove();

        //if (flag_s == false) {
            g.selectAll("circle")
                .data(datap)
                .enter().append("circle", "image")
                .attr("r", 2)
                .style("fill", "red")
                .on("mousemove", showTooltip2)
                .on("mouseout", hideTooltip2)

                .attr("transform", function (d) {
                    return "translate(" + projection([
                        d.lon,
                        d.lat,
                    ]) + ")";
                })
        //} else {
            g.selectAll("circle")
                .data(datap)
                .enter().append("circle", "image")
                .attr("r", 8 / k)
                .style("fill", "red")
                .on("mousemove", showTooltip2)
                .on("mouseout", hideTooltip2)

                .attr("transform", function (d) {

                    return "translate(" + projection([
                        d.lon,
                        d.lat,

                    ]) + ")";
                })
        //}
        //  remove the rader cgart when click on the empty area of the scatter plot
        //onceForRadar_flag = false;
        //RadarChart(".radarChart", onceForRadar, radarChartOptions, onceForRadar_flag);
        // remove the table
        //d3.selectAll(".table-remove").remove();
        //$(".html_table").css("display", "table");
        // remove the knn lines
        //focus.selectAll(".knnline").remove()
        //lineChart(null);
        //remove old lines



    }
}




/*var currentCountry;

function getCountry(name){
  if(currentCountry != name){
    currentCountry = name;
    nameChanged()
  } else {
    return false;
  }

}
function nameChanged(){
  console.log(currentCountry)
  return true;

}*/

/////////////////////////////////////////TABLE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var header;

function drawHeader(){
  header = d3.select('#tableHeader').append("tr")
    .selectAll("th")
    .data(titles)
    .enter()
    .append("th")
    .text(function(d,i){
      return d;
    })
}

function drawTable(data){
  console.log('draw', data)
  // List of groups (here I have one group per column)
  var allGroup = d3.selectAll('option');
  // add the options to the button
  d3.select("#dd")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; })


  // When the button is changed, we run the redraw to get the newly sorted data
  d3.select("#dd").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      console.log(selectedOption)
      // run the updateChart function with this selected option
      rows.sort( (a, b) => a[selectedOption] - b[selectedOption]);
      redraw(0)
  })

  /*d3.select('#current').on('change', function(d){
    var changesText= d3.select(this).property("value")
    console.log(changesText)
  })*/



  body = d3.select("#table-holder");
  //Eventuelt sette columns statisk slik at vi får fullt navn på dem??
  titles = d3.keys(data[0]);
  table = body.append("table");
  thead = table.append('thead');
  tbody = table.append("tbody");

  drawHeader()

  var rows = tbody.selectAll("tr")
    .data(data)
    .enter()
    .append("tr");

  var cells = rows.selectAll("td")
    .data(function(d){
      //TODO: does not work
      return titles.map(function(column){
        //shows countries.
        return{
          'value':d[column],
          name: column
        }
      })
    })
    .enter()
    .append("td")
    .attr('data-th',function(d,i){
      return d.name
    })
    .text(function(d){
      return d.value
  })



  d3.select("#buttons").datum({portion : 0});
  // the chain select here pushes the datum onto the up and down buttons also
  d3.select("#buttons").select("#up").on ("click", function(d) {
    d.portion -= 16;
    redraw (d.portion);

  });
    d3.select("#buttons").select("#down").on ("click", function(d) {
    d.portion += 16;
    redraw (d.portion);
  })

  redraw(0);

}

function redraw (start) {
  d3.select("table").selectAll("tr")
    .style("display", function(d,i) {
      return i >= start && i < start + 16 ? null : "none";
    })
}

function updateTableData(data){
  console.log(data)
  filteredDataset = data
  titles = d3.keys(data[0]);

  // List of groups (here I have one group per column)
  var allGroup = d3.selectAll('option');
  // add the options to the button
  d3.select("#dd")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; })

    
  // When the button is changed, we run the redraw to get the newly sorted data
  d3.select("#dd").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      console.log(selectedOption)
      // run the updateChart function with this selected option
      rows.sort( (a, b) => a[selectedOption] - b[selectedOption]);
      redraw(0)
  })


  var rows = d3.select("table").selectAll("tr")
      .remove()
      console.log('ROOOWS in Update', rows)

  rows = d3.select("table").selectAll("tr")
    .data(data)
    .enter()
    .append("tr")

  var cells = rows.selectAll("td")
    .data(function(d){
      //TODO: does not work
      return titles.map(function(column){
        
        return{
          'value':d[column],
          name: column
        }
      })
    })
    .enter()
    .append("td")
    .attr('data-th',function(d,i){
      return d.name
    })
    .text(function(d){
      return d.value
  })

  redraw(0)
}



var body;
//Eventuelt sette columns statisk slik at vi får fullt navn på dem??
var titles;
var table;
var thead;
var tbody;
var fullDataSet;
////////////////////// GETTING DATA FROM JSON FILE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
d3.json("./pca/full_dataset_pca.json", function(data){
  fullDataSet = data
  drawTable(fullDataSet)
  drawScatter(fullDataSet)
})
