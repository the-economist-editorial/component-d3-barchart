import React from 'react';
import D3 from 'd3';
import D3xAxis from '@economist/component-d3-xaxis';
import D3yAxis from '@economist/component-d3-yaxis';
import D3SeriesBars from '@economist/component-d3-series-bars';

export default class D3BarChart extends React.Component {

  // PROP TYPES
  static get propTypes() {
    return {
      hardData: React.PropTypes.array,
      test: React.PropTypes.string,
    };
  }

  // DEFAULT PROPS
  static get defaultProps() {
    return {
      hardData: [
        // 0
        {
          data: [
            {"category": "Twenty", "value": 20},
            {"category": "Forty", "value": 40},
            {"category": "Sixty", "value": 60},
            {"category": "Eighty", "value": 80},
          ],
          xdomain: [ 0, 80 ],
          ydomain: [],
          xOrient: "left",
          yOrient: "bottom",
        },
        // 1
        {
          data: [
            {"category": "Nineteen", "value": 19},
            {"category": "Thirtytwo", "value": 32},
            {"category": "Forth", "value": 40},
            {"category": "Four", "value": 4},
          ],
          xdomain: [ 0, 40 ],
          ydomain: [],
          xOrient: "right",
          yOrient: "top",
        },
        // 2
        {
          data: [
            {"category": "One-twenty", "value": 120},
            {"category": "One-thirtytwo", "value": 132},
            {"category": "Sixty", "value": 60},
            {"category": "Seventy", "value": 70},
          ],
          xdomain: [ 0, 80 ],
          ydomain: [],
          xOrient: "left",
          yOrient: "bottom",
        }
      ],
      duration: 1000,
      margins: { top: 20, right: 30, bottom: 30, left: 100 },
      dimensions: { outerWidth: 500, outerHeight: 300 },
      xorient: 'bottom',
      yorient: 'left',
      width: 300,
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
    this.state = {
      // This swapping axis orient around is just for demonstration purposes
      // In the real world, I doubt if we'd want it...
      xorient: this.props.xorient,
      yorient: this.props.yorient,
      counter: this.props.counter,
    };
  }

  // GET INITIAL STATE
  // Calculates state.bounds from size and margins props
  getInitialState() {
    const margins = this.props.margins;
    const innerW = outerW - margins.left - margins.right;
    const innerH = outerH - margins.top - margins.bottom;
    const bounds = {
      'left': margins.left,
      'top': margins.top,
      'width': innerW,
      'height': innerH,
    };
    this.setState({bounds});
  }
  // GET INITIAL STATE ends

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

    // // Assemble the x-scale object
    // const xscale = D3.scale.linear()
    //   .range([ 0, innerW ])
    //   // Currently using the default xdomain prop:
    //   .domain(this.props.xdomain);

    // // Assemble the y-scale object
    // const ydomain = this.props.hardData.map(function(d) {
    //   return d.category;
    // })
    // const yscale = D3.scale.ordinal()
    //   // NOTE: rangebands for bar charts are 'top-to-bottom', unlike
    //   // other components that run 'bottom-to-top'. This relates to
    //   // sorting...
    //   .rangeBands([ 0, innerH ], .1)
    //   .domain(ydomain);
    // // Set state
    // this.setState({ xscale, yscale, bounds });
  }

  // COMPONENT DID MOUNT
  componentDidMount() {
    const counter1 = this.state.counter + 1;
    const counter2 = this.state.counter + 2;
    setTimeout(() => {
      this.setState({ 'counter': counter1 });
    }, 1000);
    setTimeout(() => {
      this.setState({ 'counter': counter2 });
    }, 2000);

    // const xscale = this.state.xscale;
    // For testing, I'm running a couple of spurious re-draws...
    // setTimeout(() => {
    //   xscale.domain([ 0, 80 ])
    //     .range([ 0, 380 ]);
    //   this.setState({ xscale, 'xorient': 'top', 'yorient': 'right'});
    // }, 2000);
    // setTimeout(() => {
    //   xscale.domain([ 0, 120 ])
    //     .range([ 0, 350 ]);
    //   this.setState({ xscale, 'xorient': 'bottom', 'yorient': 'left' });
    // }, 4000);
  }

  configXAxis(data) {
    // Default: duration and bounds
    const config = {
      duration: this.props.duration,
      bounds: this.state.bounds
    };
    config.orient = data.xOrient;


    return config;
  }

  // RENDER
  render() {
    const counter = this.state.counter;
    const data = this.props.hardData[counter];

    const xAxisConfig = configXAxis(data);

    // // X-axis configuration
    // const xAxisConfig = {};
    //    xAxisConfig.duration = this.props.duration;
    // xAxisConfig.scale = this.state.xscale;
    // xAxisConfig.bounds = this.state.bounds;
    //    xAxisConfig.orient = this.state.xorient;

    // // Y-axis configuration
    // const yAxisConfig = {};
    // yAxisConfig.duration = this.props.duration;
    // yAxisConfig.scale = this.state.yscale;
    // yAxisConfig.bounds = this.state.bounds;
    // yAxisConfig.orient = this.state.yorient;

    // // Bar series configuration
    // const seriesBarsConfig = {};
    // seriesBarsConfig.duration = this.props.duration;
    // seriesBarsConfig.xScale = this.state.xscale;
    // seriesBarsConfig.yScale = this.state.yscale;
    // seriesBarsConfig.bounds = this.state.bounds;
    // seriesBarsConfig.data = this.props.hardData;


    /* Unresolved:
        There are a number of things that are hard-coded for now.
        These include:
          - the data is baked into the props
          - scale ranges, domains, etc all hard-coded
    */

    // Axis group (during testing, inside a hard-coded hierarchy)
                // <D3xAxis config={xAxisConfig}/>
                // <D3yAxis config={yAxisConfig}/>
                // <D3SeriesBars config={seriesBarsConfig}/>
    return (
      <div id="outerwrapper">
        <div className="chart-outer-wrapper">
          <div className="chart-inner-wrapper">
            <svg className="svg-wrapper">
              <g className="chart-main-group" transform="translate(50,50)">
              </g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
