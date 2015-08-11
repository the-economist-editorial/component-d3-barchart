import React from 'react';
import d3 from "d3";
import D3xAxis from "@economist/component-d3-xaxis";

export default class D3BarChart extends React.Component {

  static get propTypes() {
    return {
      duration: React.PropTypes.number,
      test: React.PropTypes.string,
      xaxis: React.PropTypes.object,
    };
  }

  static get defaultProps() {
    return {
      domain: [0,100],
      duration: 1000,
      height: 200,
      xaxis: {
        min: 0,
        max: 100,
        incr: 20
      },
      width: 300
    };
  }

  // CONSTRUCTOR
  //    bind handleResize to this component
  //    set default state
  constructor(props) {
    super(props);
    // this.handleResize = this.handleResize.bind(this);
    // this.nextPassState = this.nextPassState.bind(this);
    this.state = {
      duration: props.duration,
      height: props.height
    };
  }


  componentWillMount() {
    // Assemble the scale objects
    let xscale = d3.scale.linear();
    xscale
       .range([0,this.props.width])
       .domain(this.props.domain)
       ;
    this.setState({
      xscale:xscale
    });
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  // RENDER
  render() {
    let xaxisconfig = {
      duration: this.props.duration,
      height: this.props.height,
      xscale: this.props.xscale
    };

    // Axis group (during testing, inside a hard-coded hierarchy)
    return (
      <D3xAxis config={xaxisconfig}/>
    );
  }
}
