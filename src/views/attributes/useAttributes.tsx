import api from '../../api/api'
import { useFetch } from '../../hooks/useFetch'
import { HttpMethod } from '../../types/enums/HttpMethod'
import type { Attribute } from './type'

const useAttributes = () => {
  const {
    data,
    loading,
    execute: reload,
  } = useFetch<Attribute[]>({
    httpMethod: HttpMethod.GET,
    url: api.getAllAttributes,
  })

  return { data: data ?? [], loading, reload }
}

export default useAttributes
