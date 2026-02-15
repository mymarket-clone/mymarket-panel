import { useEffect, useState } from 'react'
import { axiosDefaultInstance } from '../api/axios'

export const useLookup = <T>(key?: string) => {
  const [data, setData] = useState<T[]>([])

  useEffect(() => {
    if (!key) return

    axiosDefaultInstance.get(key).then((res) => setData(res.data))
  }, [key])

  return data
}
