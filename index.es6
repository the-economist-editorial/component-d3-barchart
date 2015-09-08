import React from 'react';
import D3 from 'd3';
import D3xAxis from '@economist/component-d3-xaxis';
import D3yAxis from '@economist/component-d3-yaxis';
import D3SeriesBars from '@economist/component-d3-series-bars';

export default class D3BarChart extends React.Component {

  // PROP TYPES
  static get propTypes() {
    return {
      test: React.PropTypes.string,
      config: React.PropTypes.object.isRequired,
    };
  }

  // DEFAULT PROPS
  static get defaultProps() {
    return {
    };
  }

  // CONSTRUCTOR
  constructor(props) {
    super(props);
    // Pack state:
    this.state = {
    };
  }

  // componentWillMount() {
  //   const config = this.props.config;
  //   this.setState({transStr:"translate(" + config.bounds.left + ", " + config.bounds.top + ")"});
  // }

  // componentWillReceiveProps() {
  //   this.setState({transStr:""});
  // }

  componentDidUpdate() {
    const config = this.props.config;
    const transStr = "translate(" + config.bounds.left + ", " + config.bounds.top + ")";
    const mainGroup = d3.select('.chart-main-group');
    mainGroup.transition().duration(config.duration).attr("transform", transStr);
  }

  // CONFIG X-AXIS
  // Assembles x-axis config object with properties:
  // duration, bounds, orient, scale
  configXAxis(xConf) {
    const bounds = xConf.bounds;
    const xAxisConfig = {
      duration: xConf.duration,
      bounds,
      orient: xConf.xOrient,
    };
    // Assemble the x-scale object
    xAxisConfig.scale = D3.scale.linear()
      .range([ 0, bounds.width ])
      .domain(xConf.xDomain);

    return xAxisConfig;
  }

  // CONFIG Y-AXIS
  // Assembles y-axis config object
  configYAxis(yConf) {
    // Default: duration, bounds and orient
    const bounds = yConf.bounds;
    const yAxisConfig = {
      duration: yConf.duration,
      bounds,
      orient: yConf.yOrient,
      tickSize: 0,
    };

    // Assemble the y-scale object
    const yDomain = yConf.data.map(d => d.category);
      // NOTE: rangebands for bar charts are 'top-to-bottom', unlike
      // other components that run 'bottom-to-top'. This relates to
      // sorting...
    yAxisConfig.scale = D3.scale.ordinal()
      .rangeBands([ 0, bounds.height ], 0.1)
      .domain(yDomain);

    return yAxisConfig;
  }

  // CONFIG SERIES BARS
  // Assembles bar series config object
  configSeriesBars(seriesConf) {
    // Default: duration, bounds and orient
    const bounds = seriesConf.bounds;
    const config = {
      duration: seriesConf.duration,
      bounds,
    };
    // Assemble the x-scale object
    config.xScale = D3.scale.linear()
      .range([ 0, bounds.width ])
      .domain(seriesConf.xDomain);
    // And the data:
    config.data = seriesConf.data;
    // Assemble the y-scale object
    const yDomain = seriesConf.data.map(d => d.category);
    // Was:
    // const yDomain = seriesConf.data.map(function (d) {
    //   return d.category;
    // })
      // NOTE: rangebands for bar charts are 'top-to-bottom', unlike
      // other components that run 'bottom-to-top'. This relates to
      // sorting...
    config.yScale = D3.scale.ordinal()
      .rangeBands([ 0, bounds.height ], 0.1)
      .domain(yDomain);
    return config;
  }

  // Event fielder:

  // CATCH BAR EVENT
  // Fields events on barchart bars. The incoming object
  // is initially constructed as:
  /* 
    {
      data: {category, value},
      index: number
    }
  */
  // I assume this gets dealt with here. Is there
  // any reason why it would get passed up the tree...?
  catchBarEvent(eventObj) {
    console.log(eventObj)
  }

  // RENDER
  render() {
    const config = this.props.config;
    const xAxisConfig = this.configXAxis(config);
    const yAxisConfig = this.configYAxis(config);
    const seriesBarsConfig = this.configSeriesBars(config);

    // Main group translation string:
    // const transStr = "translate(" + config.bounds.left + ", " + config.bounds.top + ")";
    //const transStr = this.state.transStr;
    //console.log(transStr);
              // <g className="chart-main-group" transform={transStr}>
    return (      
        <div className="bar-chart-wrapper">
            <svg className="svg-wrapper">
              <g className="chart-main-group">
                <D3xAxis config={xAxisConfig}/>
                <D3yAxis config={yAxisConfig}/>
                <D3SeriesBars 
                  config={seriesBarsConfig}
                  passBarClick={this.catchBarEvent.bind(this)}
                />
              </g>
            </svg>
        </div>
    );
  }
}
