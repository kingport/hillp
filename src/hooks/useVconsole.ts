import VConsole from 'vconsole'
export function useVcosole() {
  // new VConsole({ theme: 'dark', maxLogNumber: 1000 })

  if (location.href.includes('#vc')) {
    new VConsole({ theme: 'dark', maxLogNumber: 1000 })
  }
}
