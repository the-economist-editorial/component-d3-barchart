import React from 'react';
import D3 from 'd3';
//import D3xAxis from '@economist/component-d3-xaxis';
//import D3yAxis from '@economist/component-d3-yaxis';
import D3SeriesBars from '@economist/component-d3-series-bars';

export default class D3BarChart extends React.Component {

  // PROP TYPES
  static get propTypes() {
    return {
      domain: React.PropTypes.array,
      duration: React.PropTypes.number,
      height: React.PropTypes.number,
      margins: React.PropTypes.object,
      xorient: React.PropTypes.string,
      yorient: React.PropTypes.string,
      test: React.PropTypes.string,
      width: React.PropTypes.number,
      xscale: React.PropTypes.func,
    };
  }

  // DEFAULT PROPS
  static get defaultProps() {
    return {
      tempdata: [
        {"category": "One", "value": 20},
        {"category": "Two", "value": 40},
        {"category": "Three", "value": 60},
        {"category": "Four", "value": 80},
      ],
      xdomain: [ 0, 100 ],
      ydomain: [],
      duration: 1000,
      margins: { top: 20, right: 30, bottom: 30, left: 60 },
      xorient: 'bottom',
      yorient: 'left',
      width: 300,
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
      xorient: this.props.xorient,
      yorient: this.props.yorient,
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
    const outerW = 500;
    const outerH = 300;
    const margins = this.props.margins;
    const innerW = outerW - margins.left - margins.right;
    const innerH = outerH - margins.top - margins.bottom;
    const bounds = {
      'left': margins.left,
      'top': margins.top,
      'width': innerW,
      'height': innerH,
    };

    // Assemble the x-scale object
    const xscale = D3.scale.linear()
      .range([ 0, innerW ])
      // Currently using the default xdomain prop:
      .domain(this.props.xdomain);

    // Assemble the y-scale object
    const ydomain = this.props.tempdata.map(function(d) {
      return d.category;
    })
    const yscale = D3.scale.ordinal()
      // NOTE: rangebands for bar charts are 'top-to-bottom', unlike
      // other components that run 'bottom-to-top'. This relates to
      // sorting...
      .rangeBands([ 0, innerH ], .1)
      .domain(ydomain);
    // Set state
    this.setState({ xscale, yscale, bounds });
  }

  // COMPONENT DID MOUNT
  componentDidMount() {
    const xscale = this.state.xscale;
    // For testing, I'm running a couple of spurious re-draws...
    setTimeout(() => {
      xscale.domain([ 0, 20 ])
        .range([ 0, 380 ]);
      this.setState({ xscale, 'xorient': 'top', 'yorient': 'right'});
    }, 2000);
    setTimeout(() => {
      xscale.domain([ 0, 150 ])
        .range([ 0, 350 ]);
      this.setState({ xscale, 'xorient': 'bottom', 'yorient': 'left' });
    }, 4000);
  }

  // RENDER
  render() {
    // X-axis configuration
    const xAxisConfig = {};
    xAxisConfig.duration = this.props.duration;
    xAxisConfig.scale = this.state.xscale;
    xAxisConfig.bounds = this.state.bounds;
    xAxisConfig.orient = this.state.xorient;

    // Y-axis configuration
    const yAxisConfig = {};
    yAxisConfig.duration = this.props.duration;
    yAxisConfig.scale = this.state.yscale;
    yAxisConfig.bounds = this.state.bounds;
    yAxisConfig.orient = this.state.yorient;

    // Bar series configuration
    const seriesBarsConfig = {};
    seriesBarsConfig.duration = this.props.duration;
    seriesBarsConfig.xscale = this.state.xscale;
    seriesBarsConfig.yscale = this.state.yscale;
    seriesBarsConfig.bounds = this.state.bounds;
    seriesBarsConfig.data = this.props.tempdata;

    /* Unresolved:
        There are a number of things that are hard-coded for now.
        These include:
          - the data is baked into the props
          - scale ranges, domains, etc all hard-coded
    */

    // Axis group (during testing, inside a hard-coded hierarchy)
                // <D3SeriesBars config={seriesBarsConfig}/>
                // <D3xAxis config={xAxisConfig}/>
                // <D3yAxis config={yAxisConfig}/>
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
