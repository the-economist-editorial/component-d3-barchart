import React from 'react';
import D3 from 'd3';
import D3xAxis from '@economist/component-d3-xaxis';
import D3yAxis from '@economist/component-d3-yaxis';
import D3SeriesBars from '@economist/component-d3-series-bars';

export default class D3BarChart extends React.Component {

  // PROP TYPES
  static get propTypes() {
    return {
      counter: React.PropTypes.number,
      dimensions: React.PropTypes.object,
      duration: React.PropTypes.number,
      hardData: React.PropTypes.array,
      margins: React.PropTypes.object,
      test: React.PropTypes.string,
      xOrient: React.PropTypes.string,
      yOrient: React.PropTypes.string,
    };
  }

  // DEFAULT PROPS
  static get defaultProps() {
    return {
      hardData: [
        // 0
        {
          data: [
            { 'category': 'Twenty', 'value': 20 },
            { 'category': 'Forty', 'value': 40 },
            { 'category': 'Sixty', 'value': 60 },
            { 'category': 'Eighty', 'value': 80 },
          ],
          xDomain: [ 0, 80 ],
          yDomain: [],
          xOrient: 'bottom',
          yOrient: 'left',
        },
        // 1
        {
          data: [
            { 'category': 'Nineteen', 'value': 19 },
            { 'category': 'Thirtytwo', 'value': 32 },
            { 'category': 'Forth', 'value': 40 },
            { 'category': 'Four', 'value': 4 },
          ],
          xDomain: [ 0, 40 ],
          yDomain: [],
          xOrient: 'top',
          yOrient: 'right',
        },
        // 2
        {
          data: [
            { 'category': 'One-twenty', 'value': 120 },
            { 'category': 'One-thirtytwo', 'value': 132 },
            { 'category': 'Sixty', 'value': 60 },
            { 'category': 'Seventy', 'value': 70 },
          ],
          xDomain: [ 0, 150 ],
          yDomain: [],
          xOrient: 'bottom',
          yOrient: 'left',
        },
      ],
      duration: 1000,
      margins: { top: 20, right: 30, bottom: 30, left: 100 },
      dimensions: { outerWidth: 500, outerHeight: 300 },
      xOrient: 'bottom',
      yOrient: 'left',
      // Counter is for tests only:
      counter: 0,
      // xscale: {
      //   min: 0,
      //   max: 100,
      //   incr: 20
      // }
    };
  }

  // CONSTRUCTOR
  constructor(props) {
    super(props);
    // D3 bounds and margins
    const dimensions = this.props.dimensions;
    const margins = this.props.margins;
    const outerH = dimensions.outerHeight;
    const outerW = dimensions.outerWidth;
    const innerW = outerW - margins.left - margins.right;
    const innerH = outerH - margins.top - margins.bottom;
    const bounds = {
      'left': margins.left,
      'top': margins.top,
      'width': innerW,
      'height': innerH,
    };
    // Pack state:
    this.state = {
      // This swapping axis orient around is just for demonstration purposes
      // In the real world, I doubt if we'd want it...
      xOrient: this.props.xOrient,
      yOrient: this.props.yOrient,
      counter: this.props.counter,
      bounds,
    };
  }

  // COMPONENT WILL MOUNT
  componentWillMount() {
    // Size and margins:
    //      *** This is probably going to be inherited.
    //      *** But hard-coded here for now...
    // 'margins' is a default prop...
    // ...but note that, on bar charts, it will be over-rideable
    // from category string lengths...

    // Immediate problem: we don't know the size of this component
    // until it has rendered... but size is presumably inherited (?)
    // So comm'd out for now: using hard values...
    // const outerW = React.findDOMNode(this).offsetWidth;
    // const outerH = React.findDOMNode(this).offsetHeight;


  }

  // COMPONENT DID MOUNT
  // For testing, just sets a couple of timeouts and increments
  // a counter to redraw with new data...
  componentDidMount() {
    const counter1 = this.state.counter + 1;
    const counter2 = this.state.counter + 2;
    setTimeout(() => {
      this.setState({ 'counter': counter1 });
    }, 2000);
    setTimeout(() => {
      this.setState({ 'counter': counter2 });
    }, 4000);
  }

  // CONFIG X-AXIS
  // Assembles x-axis config object
  configXAxis(xData) {
    // Default: duration, bounds and orient
    const bounds = this.state.bounds;
    const config = {
      duration: this.props.duration,
      bounds,
      orient: xData.xOrient,
    };
    // Assemble the x-scale object
    config.scale = D3.scale.linear()
      .range([ 0, bounds.width ])
      .domain(xData.xDomain);

    return config;
  }

  // CONFIG Y-AXIS
  // Assembles y-axis config object
  configYAxis(yData) {
    // Default: duration, bounds and orient
    const bounds = this.state.bounds;
    const config = {
      duration: this.props.duration,
      bounds,
      orient: yData.yOrient,
    };

    // Assemble the y-scale object
    const yDomain = yData.data.map(function (d) {
      return d.category;
    })
      // NOTE: rangebands for bar charts are 'top-to-bottom', unlike
      // other components that run 'bottom-to-top'. This relates to
      // sorting...
    config.scale = D3.scale.ordinal()
      .rangeBands([ 0, bounds.height ], 0.1)
      .domain(yDomain);

    return config;
  }

  // CONFIG SERIES BARS
  // Assembles bar series config object
  configSeriesBars(seriesData) {
    // Default: duration, bounds and orient
    const bounds = this.state.bounds;
    const config = {
      duration: this.props.duration,
      bounds,
    };
    // Assemble the x-scale object
    config.xScale = D3.scale.linear()
      .range([ 0, bounds.width ])
      .domain(seriesData.xDomain);
    // And the data:
    config.data = seriesData.data;
    // Assemble the y-scale object
    const yDomain = seriesData.data.map(function (d) {
      return d.category;
    })
      // NOTE: rangebands for bar charts are 'top-to-bottom', unlike
      // other components that run 'bottom-to-top'. This relates to
      // sorting...
    config.yScale = D3.scale.ordinal()
      .rangeBands([ 0, bounds.height ], 0.1)
      .domain(yDomain);
    return config;
  }

  // RENDER
  render() {
    const counter = this.state.counter;
    const data = this.props.hardData[counter];
    const xAxisConfig = this.configXAxis(data);
    const yAxisConfig = this.configYAxis(data);
    const seriesBarsConfig = this.configSeriesBars(data);
    /* Unresolved:
        There are a number of things that are hard-coded for now.
        These include:
          - the data is baked into the props
          - scale ranges, domains, etc all hard-coded
    */
    // Axis group (during testing, inside a hard-coded hierarchy)
    return (
      <div id="outerwrapper">
        <div className="chart-outer-wrapper">
          <div className="chart-inner-wrapper">
            <svg className="svg-wrapper">
              <g className="chart-main-group" transform="translate(50,50)">
                <D3xAxis config={xAxisConfig}/>
                <D3yAxis config={yAxisConfig}/>
                <D3SeriesBars config={seriesBarsConfig}/>
              </g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
