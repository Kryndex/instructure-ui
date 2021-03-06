import React from 'react'
import ProgressBar from '../index'

describe('<ProgressBar />', () => {
  const testbed = new Testbed(
    <ProgressBar
      label="Loading completion"
      valueNow={40}
      valueMax={60}
    />
  )

  /* example test (replace me) */
  it('should render', () => {
    const subject = testbed.render(/* override default props here */)

    expect(subject).to.be.present
  })

  it('should have tests')

  it('should meet a11y standards', (done) => {
    const subject = testbed.render()

    subject.should.be.accessible(done)
  })
})
