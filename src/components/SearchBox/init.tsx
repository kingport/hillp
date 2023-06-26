// import { Input } from 'antd-mobile'
// import React from 'react'
// import styles from './index.module.scss'
// import { useJsApiLoader, LoadScript, StandaloneSearchBox } from '@react-google-maps/api'

// export const InitAutocomplete = (props: any) => {
//   const { value, onChange, transparent, onConfirm } = props
//   // const ref = useRef(null)
//   // const refs: any = {}
//   // const [onSearchBoxMounted] = useState((ref) => {
//   //   refs.searchBox = ref
//   // })
//   // const { isLoaded } = useJsApiLoader({
//   //   googleMapsApiKey: 'AIzaSyCCBpbKOMuHO_O2156i6aBmwhHTmovrP_8',
//   //   libraries: ['places', 'geometry', 'drawing'],
//   // })

//   useLayoutEffect(() => {
//     const input = document.getElementById('pac-input') as HTMLInputElement
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     const defaultBounds = new google.maps.LatLngBounds(
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       new google.maps.LatLng(-33.8902, 151.1759),
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       new google.maps.LatLng(-33.8474, 151.2631)
//     )

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     const searchBox = new google.maps.places.SearchBox(input, {
//       bounds: defaultBounds,
//     })

//     searchBox.addListener('places_changed', () => {
//       const places: any = searchBox?.getPlaces()

//       if (places.length == 0) {
//         return
//       }

//       places.forEach((place: any) => {
//         if (!place.geometry || !place.geometry.location) {
//           return
//         }

//         if (place?.formatted_address) {
//           onRealValueChange(place)
//         }
//       })
//     })
//   }, [])

//   const triggerValue = (changedValue: any) => {
//     onChange?.(changedValue)
//   }

//   const onRealValueChange = (value: any) => {
//     triggerValue(value.formatted_address || value)
//     if (onConfirm && value.formatted_address) {
//       return onConfirm?.(value)
//     }
//   }

//   return (
//     // <LoadScript id="script-loader" googleMapsApiKey="AIzaSyCCBpbKOMuHO_O2156i6aBmwhHTmovrP_8" libraries={['places']}>
//     //   <StandaloneSearchBox
//     //     bounds={{
//     //       north: -33.8474,
//     //       south: -33.8902,
//     //       east: 151.1759,
//     //       west: 151.2631,
//     //     }}
//     //     // onLoad={onLoad}
//     //     ref={(ref) => (refs.searchBox = ref)}
//     //     onPlacesChanged={() => {
//     //       //
//     //       console.log(refs.searchBox.getPlaces(), 'EEE')
//     //     }}
//     //   >
//     //   <Input
//     //     ref={ref}
//     //     // style={{ width: '80vw' }}
//     //     id="pac-input"
//     //     value={value}
//     //     className={`${styles.controls} ${transparent ? styles.controlsTransparent : ''} w-full`}
//     //     onChange={onRealValueChange}
//     //     type="text"
//     //     placeholder="请输入地址"
//     //     {...props}
//     //   />
//     //   </StandaloneSearchBox>
//     // </LoadScript>
//     <Input
//       id="pac-input"
//       value={value}
//       className={`${styles.controls} ${transparent ? styles.controlsTransparent : ''} w-full`}
//       onChange={onRealValueChange}
//       type="text"
//       placeholder="请输入地址"
//       {...props}
//     />
//   )
// }
import React from 'react'
import { Input } from 'antd-mobile'
import styles from './index.module.scss'

export const InitAutocomplete = (props: any) => {
  const { value, onChange, transparent, onConfirm, placeholder = '请输入地址', style = {} } = props

  useLayoutEffect(() => {
    const input = document.getElementById('pac-input') as HTMLInputElement

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const defaultBounds = new google.maps.LatLngBounds(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new google.maps.LatLng(-33.8902, 151.1759),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new google.maps.LatLng(-33.8474, 151.2631)
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const searchBox = new google.maps.places.SearchBox(input, {
      bounds: defaultBounds,
    })

    searchBox.addListener('places_changed', () => {
      const places: any = searchBox.getPlaces()

      if (places.length == 0) {
        return
      }

      places.forEach((place: any) => {
        if (!place.geometry || !place.geometry.location) {
          return
        }

        if (place?.formatted_address) {
          onRealValueChange(place)
        }
      })
    })
  }, [])

  const triggerValue = (changedValue: any) => {
    onChange?.(changedValue)
  }

  const onRealValueChange = (value: any) => {
    triggerValue(value.formatted_address || value)
    if (onConfirm && value.formatted_address) {
      return onConfirm?.(value)
    }
  }

  return (
    <Input
      id="pac-input"
      value={value}
      className={`${styles.controls} ${transparent ? styles.controlsTransparent : ''}`}
      onChange={onRealValueChange}
      type="text"
      placeholder={placeholder}
      style={style}
    />
  )
}
