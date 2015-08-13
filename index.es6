import React from 'react';
import d3 from 'd3';
import D3xAxis from '@economist/component-d3-xaxis';

export default class D3BarChart extends React.Component {

  // PROP TYPES
  static get propTypes() {
    return {
      domain: React.PropTypes.array,
      duration: React.PropTypes.number,
      height: React.PropTypes.number,
      margins: React.PropTypes.object,
      orient: React.PropTypes.string,
      test: React.PropTypes.string,
      width: React.PropTypes.number,
      xscale: React.PropTypes.func,
    };
  }

  // DEFAULT PROPS
  static get defaultProps() {
    return {
      domain: [ 0, 100 ],
      duration: 1000,
      margins: { top: 20, right: 30, bottom: 30, left: 60 },
      orient: 'bottom',
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
      orient: this.props.orient,
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
    // Assemble the scale object
    const xscale = d3.scale.linear()
      .range([ 0, innerW ])
      .domain(this.props.domain);
    // const xaxis = d3.svg.axis();
    this.setState({ xscale, bounds });
  }

  // COMPONENT DID MOUNT
  componentDidMount() {
    const xscale = this.state.xscale;
    // For testing, I'm running a couple of spurious re-draws...
    setTimeout(() => {
      xscale.domain([ 0, 20 ])
        .range([ 0, 380 ]);
      this.setState({ xscale, 'orient': 'top' });
    }, 2000);
    setTimeout(() => {
      xscale.domain([ 0, 150 ])
        .range([ 0, 350 ]);
      this.setState({ xscale, 'orient': 'bottom' });
    }, 4000);
  }

  // RENDER
  render() {
    const config = {};
    config.duration = this.props.duration;
    config.xscale = this.state.xscale;
    config.bounds = this.state.bounds;
    config.orient = this.state.orient;

    // Axis group (during testing, inside a hard-coded hierarchy)
    return (
      <div id="outer-wrapper">
        <div className="chart-outer-wrapper">
          <div className="chart-inner-wrapper">
            <svg className="svg-wrapper">
              <g className="chart-main-group" transform="translate(50,50)">
                <D3xAxis config={config}/>
              </g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
