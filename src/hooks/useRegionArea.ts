import UserApi from '@/http/api/user'
import React from 'react'

const useRegionArea = () => {
  const [region, setRegion] = useState<any>([])
  const [area, setArea] = useState<any>([])

  const getRegionAndArea = async () => {
    const res = await UserApi.getRegionAndArea()
    if (res?.status === 200) {
      res?.data?.region?.map((r: any) => {
        r.label = r.name
        r.value = r.id
        r.key = r.id
      })
      res?.data?.area?.map((a: any) => {
        a.label = a.name
        a.value = a.id
        a.key = a.id
      })
      setRegion(res?.data?.region)
      setArea(res?.data?.area)
    }
  }

  useEffect(() => {
    getRegionAndArea()
  }, [])

  return {
    region,
    area,
  }
}

export default useRegionArea
