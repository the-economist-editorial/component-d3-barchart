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
      config: {
        'context': 'print',
        'data': [
          { 'category': 'Twenty', 'value': 20 },
          { 'category': 'Forty', 'value': 40 },
          { 'category': 'Seventy', 'value': 70 },
          { 'category': 'Eighty', 'value': 80 },
        ],
        'dimensions': { 'width': 500, 'height': 300 },
        'duration': 0,
        'margins': { 'top': 30, 'right': 30, 'bottom': 30, 'left': 60 },
        'xDomain': [ 0, 80 ],
        'yDomain': [],
        'xOrient': 'bottom',
        'yOrient': 'left',
        'style': 'bars',
        bounds: { 'left': 50, 'top': 50, 'width': 500, 'height': 150 },
      },
    };
  }

  // CONSTRUCTOR
  constructor(props) {
    super(props);
    // Pack state:
    this.state = {
      // Duration defaults to zero for initial render.
      // Thereafter, componentWillReceiveProps overwrites
      // with inherited duration
      duration: 0,
    };
  }

  //
  // =======================
  // React lifecycle methods:
  // =======================

  // Invoked after initial mount
  componentDidMount() {
    this.mainD3GroupTransition();
  }

  // Invoked when new props are received AFTER initial render
  // This.setState doesn't force a premature render. So I'm
  // just using this to force use of inherited duration ofter
  // initial render is forced to default zero...
  componentWillReceiveProps(newprops) {
    this.setState({
      duration: newprops.config.duration,
      // duration: 1000,
     });
  }

  // Invoked after post-initial renders
  componentDidUpdate() {
    this.mainD3GroupTransition();
  }

  //
  // ==================================
  // D3 component configuration objects:
  // ==================================

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

  //
  // =========================
  // Event handlers and others:
  // =========================

  // MAIN D3 GROUP TRANSITION
  // Called from componentDidMount and componentDidUpdate
  // Animates main D3 group to position
  mainD3GroupTransition() {
    const config = this.props.config;
    const transStr = 'translate(' + config.bounds.left + ', ' + config.bounds.top + ')';
    const mainGroup = D3.select('.chart-main-group');
    mainGroup.transition().duration(config.duration).attr('transform', transStr);
  }

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
    eventObj += 'OK';
  }
  // ========== COMM'D OUT FOR LINTING ==========

  // RENDER
  render() {
    const config = this.props.config;
    // Overwrite duration: this allows me to force zero duration
    // at initial render...
    config.duration = this.state.duration;
    // Config objects for the various d3 components:
    const xAxisConfig = this.configXAxis(config);
    const yAxisConfig = this.configYAxis(config);
    const seriesBarsConfig = this.configSeriesBars(config);
    //
    // This is dead code:
    // Early on, I tried to animate the main d3 chart group's position
    // here. But in the end it seems better to let componentDidMount and
    // componentDidUpdate force D3 transitions...
    /*
    let transStr;
    if (this.state.firstTransition) {
      transStr = 'translate(' + config.bounds.left + ', ' + config.bounds.top + ')';
    } else {
      transStr = '';
    }
          // <g className="chart-main-group" transform={transStr}>
    */

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
          </g>;
        </svg>
      </div>
    );
  }
}
