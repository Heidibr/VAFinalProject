


d3.csv("./data/convertcsv.csv", function(data){

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


  var body = d3.select("#table-holder");
  //Eventuelt sette columns statisk slik at vi får fullt navn på dem??
  var titles = d3.keys(data[0]);
  var table = body.append("table");
  var thead = table.append('thead');
  var tbody = table.append("tbody");


   header = thead.append("tr")
      .selectAll("th")
      .data(titles)
      .enter()
      .append("th")
      .text(function(d,i){
        return d;
    })

    var rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr")

      console.log(rows)
    var cells = rows.selectAll("td")
      .data(function(d){
        return titles.map(function(column){
          //shows countries.
          //console.log(row["Country"])
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

      console.log('dette er thead:', titles);

      function redraw (start) {
        d3.select("table").selectAll("tr")
          .style("display", function(d,i) {
            return i >= start && i < start + 16 ? null : "none";
          })
      }
      redraw(0);



})
