import { calSaveAmount } from './utils'

describe('calSaveAmount function', () => {
  it('normal case for buy order', async () => {
    const savedAmount = await calSaveAmount(
      'buy',
      20,
      {
        bxth: 23,
        satang: 24
      }
    )
    expect(savedAmount).toBe(4)
  })
  it('normal case for sell order', async () => {
    const savedAmount = await calSaveAmount(
      'sell',
      25,
      {
        bxth: 23,
        satang: 24
      }
    )
    expect(savedAmount).toBe(2)
  })
  it('we are the worst on buy side', async () => {
    const savedAmount = await calSaveAmount(
      'buy',
      27,
      {
        bxth: 23,
        satang: 24
      }
    )
    expect(savedAmount).toBe(0)
  })
  it('we are the worst on sell side', async () => {
    const savedAmount = await calSaveAmount(
      'sell',
      21,
      {
        bxth: 23,
        satang: 24
      }
    )
    expect(savedAmount).toBe(0)
  })
})