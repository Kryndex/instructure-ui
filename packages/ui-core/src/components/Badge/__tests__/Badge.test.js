import React from 'react'
import Badge from '../index'
import styles from '../styles.css'

describe('<Badge />', () => {
  const testbed = new Testbed(
    <Badge count={100}>
      <button type="button">Inbox</button>
    </Badge>
  )

  it('should show the count', () => {
    const subject = testbed.render()

    const badge = subject.find(`.${styles.badge}`)
    expect(badge.findText('100').length).to.equal(1)
  })

  it('should truncate the count via countUntil', () => {
    const subject = testbed.render({countUntil: 100})

    const badge = subject.find(`.${styles.badge}`)
    expect(badge.findText('99 +').length).to.equal(1)
  })

  it('should change postion based on the placement prop', () => {
    const subject = testbed.render({placement: 'bottom start'})

    const badgeBottom = subject.find(`span.${styles['positioned--bottom']}`)
    expect(badgeBottom).to.be.present

    const badgeStart = subject.find(`span.${styles['positioned--start']}`)
    expect(badgeStart).to.be.present
  })

  it('should not render a wrapper for a standalone Badge', () => {
    const subject = testbed.render({standalone: true})

    expect(subject.find(`.${styles.wrapper}`).length).to.equal(0)
  })

  it('should change its output via the formatOutput prop', () => {
    const subject = testbed.render({
      count: 15,
      formatOutput: function (formattedCount) {
        return `My count is ${formattedCount}`
      }
    })

    const badge = subject.find(`.${styles.badge}`)
    expect(badge.findText('My count is 15').length).to.equal(1)
  })

  it('should meet a11y standards', (done) => {
    const subject = testbed.render()

    subject.should.be.accessible(done, {
      ignores: [  /* add a11y standards rules to ignore here (https://dequeuniversity.com/rules/axe) */ ]
    })
  })
})
