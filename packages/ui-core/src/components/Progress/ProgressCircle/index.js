import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import themeable from '@instructure/ui-themeable'
import CustomPropTypes from '@instructure/ui-utils/lib/react/CustomPropTypes'

import Container from '../../Container'

import styles from './styles.css'
import theme from './theme'

@themeable(theme, styles)
export default class ProgressCircle extends Component {
  /* eslint-disable react/require-default-props */
  static propTypes = {
    /**
    * A label is required for accessibility
    */
    label: PropTypes.string.isRequired,
    /**
    * Different-sized progress bars and circles
    */
    size: PropTypes.oneOf(['x-small', 'small', 'medium', 'large']),
    /**
    * Maximum value (defaults to 100)
    */
    valueMax: PropTypes.number,
    /**
    * Receives the progress of the event
    */
    valueNow: PropTypes.number,
    /**
    * A function that returns the current value formatted for screen readers
    */
    formatValueText: PropTypes.func,
    /**
    * A function to format the displayed value. If null the value will not display.
    */
    formatDisplayedValue: PropTypes.func,
    /**
    * Animate the progress meter to the current value when the component
    * has mounted
    */
    animateOnMount: PropTypes.bool,
    /**
    * The bar changes to your theme's success color when complete
    */
    successColor: PropTypes.bool,
    /**
    * Choose either a progress bar or circle. The `-inverse` variants are for
    * when you need the Progress component to appear on inverse backgrounds
    */
    variant: PropTypes.oneOf(['default', 'inverse']),
    /**
    * Valid values are `0`, `none`, `auto`, `xxx-small`, `xx-small`, `x-small`,
    * `small`, `medium`, `large`, `x-large`, `xx-large`. Apply these values via
    * familiar CSS-like shorthand. For example: `margin="small auto large"`.
    */
    margin: CustomPropTypes.spacing
  }
  /* eslint-enable react/require-default-props */

  static defaultProps = {
    formatValueText: (valueNow, valueMax) => `${valueNow} / ${valueMax}`,
    size: 'medium',
    valueMax: 100,
    valueNow: 0,
    variant: 'default',
    showValue: false,
    animateOnMount: false,
    successColor: true
  }

  constructor (props) {
    super()

    this.state = {
      animateOnMount: props.animateOnMount
    }
  }

  _timeouts = []

  componentWillMount () {
    if (this.state.animateOnMount) {
      this._timeouts.push(setTimeout(() => {
        this.setState({
          animateOnMount: false
        })
      }, 500))
    }
  }

  componentWillUnmount () {
    this._timeouts.forEach((timeout) => clearTimeout(timeout))
  }

  circumference () {
    const camelSize = this.props.size === 'x-small' ? 'xSmall' : this.props.size
    // get the circumference of the meter circle
    return parseFloat(this.theme[`${camelSize}Circumference`])
  }

  radius () {
    const camelSize = this.props.size === 'x-small' ? 'xSmall' : this.props.size
    return this.theme[`${camelSize}Radius`]
  }

  dashOffset () {
    const {
      valueNow,
      valueMax
    } = this.props

    // send the stroke-dashoffset to the meter circle, checking
    // to make sure current value doesn't exceed max value
    if (valueNow < valueMax) {
      const circumference = this.circumference()
      // figure out how much offset to give the stroke to show the % complete
      return circumference - ((valueNow / valueMax) * circumference)
    } else {
      return 0
    }
  }

  render () {
    const classes = {
      [styles.root]: true,
      [styles[this.props.size]]: true,
      [styles[this.props.variant]]: true,
      [styles.animateOnMount]: this.state.animateOnMount,
      [styles.done]: this.props.successColor &&
        this.props.valueNow / this.props.valueMax >= 1
    }

    const {
      formatDisplayedValue,
      formatValueText,
      valueNow,
      valueMax,
      label
    } = this.props

    const valueText = formatValueText(valueNow, valueMax)
    const value = (typeof formatDisplayedValue === 'function') && formatDisplayedValue(valueNow, valueMax)

    const style = this.state.animateOnMount ? null : {
      strokeDashoffset: `${this.dashOffset()}em`
    }

    const radius = this.radius()

    return (
      <Container
        as="div"
        className={classnames(classes)}
        margin={this.props.margin}
        role="progressbar"
        aria-valuetext={valueText}
        aria-valuenow={valueNow}
        aria-valuemax={valueMax}
        aria-label={label}
      >
        { value && <span className={styles.center}><span className={styles.value}>{value}</span></span> }
        <svg
          className={styles.circle}
          role="presentation"
          focusable="false"
        >
          <circle
            className={styles.shadow}
            role="presentation"
            cx="50%"
            cy="50%"
            r={radius}
          />
          <circle
            className={styles.track}
            role="presentation"
            cx="50%"
            cy="50%"
            r={radius}
          />
          <circle
            className={styles.meter}
            role="presentation"
            style={style}
            cx="50%"
            cy="50%"
            r={radius}
          />
        </svg>
      </Container>
    )
  }
}
