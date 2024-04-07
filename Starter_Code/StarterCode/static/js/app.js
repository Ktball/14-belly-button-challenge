function selectedMetadata(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        let metadata = data.metadata;
        //filter the data to get the specific sample number
        let filteredMetadata = metadata.filter((d) => d.id == sample);
        let result = filteredMetadata[0];
        //select the div to display the metadata
        let metadataDiv = d3.select("#sample-metadata");
        //clear current metadata
        metadataDiv.html("");
        //append the metadata information to the <div> element
        for (key in result){
            metadataDiv.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
        }
    });
}



function constructCharts(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let samples = data.samples;
    let filteredSamples = samples.filter((d) => d.id == sample);
    let result = filteredSamples[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    let washFrequency = result.wfreq;

    //Construct the reverse bar chart
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [{
        type: 'bar',
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        y: yticks,
        orientation: 'h'
    }];
    let barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {l:100, t:50}
    };
    //console.log("Bar Chart Data:", barData);
    //console.log("Bar Chart Layout:", barLayout);
        
    Plotly.newPlot('bar', barData, barLayout);
    

    
    //construct bubble chart
    let bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Earth'
        }
    }];
    let bubbleLayout = {
        title: "Bacteria Cultures per Sample",
        margin: {t:75},
        hovermode: 'closest',
        xaxis: {title: "OTU ID"}
    };
    //console.log(bubbleData);
      //console.log(bubbleLayout);
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //build gauge for wash frequency
    let wfGauge = {
        type: "indicator",
        mode: "gauge+number+delta",
        value: washFrequency,
        title: { text: "Scrubs per Week", font: { size: 24 } },
        delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
        gauge: {
            axis: { range: [0,9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { colorscale: "Greens" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
                steps: [
                  { range: [0, 1], color: "white" },
                  { range: [1, 2], color: "ivory" },
                  { range: [2, 3], color: "green" },
                  { range: [3, 4], color: "lightgreen" },
                  { range: [4, 5], color: "green" },
                  { range: [5, 6], color: "green" },
                  { range: [6, 7], color: "cyan" },
                  { range: [7, 8], color: "green" },
                  { range: [8, 9], color: "dark green" }
                ],
              }
            };

        wfGauge.value = washFrequency;
          
        let layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            font: { color: "darkblue", family: "Arial" }
          };
          
          Plotly.newPlot("gauge", [wfGauge], layout);
    });
}


function init() {
    let dropDown = d3.select("#selDataset");
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        let names = data.names;
        for(let i=0; i<names.length; i++){
            dropDown.append("option").text(names[i]).property("value", names[i]);
        }
    
    //use first set of data to construct initial charts
        let firstSubject = names[0];
        selectedMetadata(firstSubject);
        constructCharts(firstSubject); 
    });
}

function optionChanged(newSample) {
    selectedMetadata(newSample);
    constructCharts(newSample);
}

//initialize dashboard
init();
