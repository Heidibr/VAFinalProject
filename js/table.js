var softwarCompanies = [{
    rank: 1,
    country: "United States",
    company: "Microsoft",
    sales: 86.6,
    marketCapital: 407,
    headOffice: "Redmond"
},
{
    rank: 2,
    country: "United States",
    company: "Oracle",
    sales: 37.2,
    marketCapital: 168.9,
    headOffice: "Redmond"

},
{
    rank: 3,
    country: "Germany",
    company: "SAP",
    sales: 23.2,
    marketCapital: 98.4,
    headOffice: "Walldorf"
},
{
    rank: 4,
    country: "United States",
    company: "Salesforce.com",
    sales: 8.4,
    marketCapital: 51.9,
    headOffice: "San Francisco"

}, {
    rank: 5,
    country: "United States",
    company: "VMware",
    sales: 6.7,
    marketCapital: 24.7,
    headOffice: "Palo Alto"

}, {
    rank: 6,
    country: "United States",
    company: "Fiserv",
    sales: 5.3,
    marketCapital: 21.9,
    headOffice: "Brookfield WI"

},
{
    rank: 7,
    country: "United States",
    company: "Adobe Systems",
    sales: 5,
    marketCapital: 47.4,
    headOffice: "San Jose, CA"

},
{
    rank: 8,
    country: "United States",
    company: "Symantec",
    sales: 5.4,
    marketCapital: 11.7,
    headOffice: "Mountain View"

},
{
    rank: 9,
    country: "Spain",
    company: "Amadeus IT Holdings",
    sales: 4.3,
    marketCapital: 19.6,
    headOffice: "Madrid"
}
];

var body = d3.select("#table");
var table = body.append("table");
var thead = table.append("thead")
var tbody = table.append("tbody");

var columns = ["rank","country","company","sales","marketCapital","headOffice"];
thead.append("tr")
.selectAll("th")
.data(columns)
.enter()
.append("th")
.text(function(d,i){
  return d;
});

var rows = tbody.selectAll("tr")
.data(softwarCompanies)
.enter()
.append("tr")
// .text(function(d,i){
//   return d;
// })
var cells = rows.selectAll("td")
.data(function(row){
  return columns.map(function(column){
    console.log(column);
    console.log(row[column])
    return{
      column:column,
      value:row[column]
    }
  })
})
.enter()
.append("td")
.text(function(d,i){
  return d.value;
})


        