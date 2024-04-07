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
