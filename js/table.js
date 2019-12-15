
var dd = d3.select("#dd")

d3.csv("./data/convertcsv.csv", function(data){

// List of groups (here I have one group per column)
var allGroup = d3.selectAll('option')

// add the options to the button
d3.select("#dd")
  .selectAll('myOptions')
   .data(allGroup)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; })

  // A function that update the chart
  function update(selectedGroup) {
    // Create new data with the selection?
    var dataFilter = data.map(function(d){return d.ISrank})
    sorted = sortByRank(dataFilter)


  }

  function sortByRank(rank){
    sorted = rank.sort((a, b) => a - b)
    console.log(sorted)
  }
        
  // When the button is changed, run the updateChart function
  d3.select("#dd").on("click", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      console.log(selectedOption)
      // run the updateChart function with this selected option
      update(selectedOption)
  })

  var body = d3.select("#table-holder");
  var table = body.append("table");
  var thead = table.append("thead")
  var tbody = table.append("tbody");
    var columns = data.columns;
    header = thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .text(function(d,i){
        return d;
    });
    var rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr")

    var cells = rows.selectAll("td")
      .data(function(row){
        return columns.map(function(column){
          //shows countries. 
          //console.log(row["Country"])
          return{
            column:column,
            value:row[column]
          }
        })
      })
      .enter()
      .append("td")
      .text(function(d,i){
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
      


      function redraw (start) {
        d3.select("table").selectAll("tr")
          .style("display", function(d,i) {
            return i >= start && i < start + 16 ? null : "none";
          })
      }
      redraw(0);
    
      
    
})

