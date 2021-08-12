import DePayWidgets from 'src'

describe('Payment', () => {

  describe('preflight', () => {

    let document

    beforeEach(()=>{
      document = jest.fn()
    })

    it('requires you to set a blockchain', async ()=> {
      await expect(
        ()=>DePayWidgets.Payment({ blockchain: undefined, document })
      ).rejects.toEqual('DePayWidgets.Payment: You need to set the blockchain your want to receive the payment on!')
    })

    it('requires you to set a supported blockchain', async ()=> {
      await expect(
        ()=>DePayWidgets.Payment({ blockchain: 'notsupported', document })
      ).rejects.toEqual('DePayWidgets.Payment: You need to set a supported blockchain!')
    })

    it('requires you to set an amount', async ()=> {
      await expect(
        ()=>DePayWidgets.Payment({ blockchain: 'ethereum', amount: undefined, document })
      ).rejects.toEqual('DePayWidgets.Payment: You need to set the amount you want to receive as payment!')
    })

    it('requires you to set a token', async ()=> {
      await expect(
        ()=>DePayWidgets.Payment({ blockchain: 'ethereum', amount: '20', token: undefined, document })
      ).rejects.toEqual('DePayWidgets.Payment: You need to set the token you want to receive as payment!')
    })

    it('requires you to set a token', async ()=> {
      await expect(
        ()=>DePayWidgets.Payment({ blockchain: 'ethereum', amount: '20', token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb', receiver: undefined, document })
      ).rejects.toEqual('DePayWidgets.Payment: You need to set the receiver address that you want to receive the payment!')
    })
  });
});
