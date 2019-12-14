

d3.csv("./data/convertcsv.csv", function(data){
  var body = d3.select("#table-holder");
  var table = body.append("table");
  var thead = table.append("thead")
  var tbody = table.append("tbody");
    var columns = data.columns;
    thead.append("tr")
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
      // .text(function(d,i){
      //   return d;
      // })
    var cells = rows.selectAll("td")
      .data(function(row){
        return columns.map(function(column){
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





        