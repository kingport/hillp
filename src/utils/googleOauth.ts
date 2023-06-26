const id = '531794614018-8c2lhntpjl90f4ikopu54bsbafp8ph8h.apps.googleusercontent.com'

export const loginUser = async () => {
  const tokenResponse = await new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore initTokenClient
      const goog = window.google.accounts.id
      goog.initialize({
        client_id: id,
        scope: `profile email`,
        callback: handleCredentialResponse, // defined at request time
      })
      // Settle this promise in the response callback for requestAccessToken()
      // eslint-disable-next-line no-inner-declarations
      function handleCredentialResponse(resp: any) {
        if (resp.error !== undefined) {
          reject(resp)
        }

        resolve(resp)
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore initTokenClient
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          //
        }
      })
    } catch (err) {
      console.error('loginUser err', err)
    }
  })
  return tokenResponse
}
