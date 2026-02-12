import { useState, useCallback, useEffect } from 'react'
import type { FormInstance } from 'antd'
import { HttpMethod } from '../types/enums/HttpMethod'
import { axiosDefaultInstance } from '../api/axios'
import { applyAxiosFormErrors } from '../api/axiosErrors'
import type { IBaseError } from '../interfaces/response/IBaseResponse'
import type { AxiosError } from 'axios'

type UseApiProps<
  Body = unknown,
  Params = Record<string, unknown>,
  FormValues extends Record<string, unknown> = Record<string, unknown>,
> = {
  url: string
  httpMethod: HttpMethod
  body?: Body
  params?: Params
  form?: FormInstance<FormValues>
  enabled?: boolean
}

type ApiResponse<Data> = Data | IBaseError

export function useFetch<
  Data extends object,
  Body = unknown,
  Params = Record<string, unknown>,
  FormValues extends Record<string, unknown> = Record<string, unknown>,
>(props: UseApiProps<Body, Params, FormValues>) {
  const { url, httpMethod, body, params, form, enabled = true } = props

  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown | null>(null)

  type ExecuteProps = {
    body?: Body
    params?: Params
    onSuccess?: (data: Data) => void
    onError?: (error: unknown) => void
  }

  const execute = useCallback(
    async ({
      body: overrideBody,
      params: overrideParams,
      onSuccess,
      onError,
    }: ExecuteProps = {}): Promise<Data | null> => {
      setLoading(true)
      setError(null)

      try {
        let response
        const requestBody = overrideBody ?? body
        const requestParams = overrideParams ?? params

        if (httpMethod === HttpMethod.GET || httpMethod === HttpMethod.DELETE) {
          response = await axiosDefaultInstance[httpMethod]<ApiResponse<Data>>(url, {
            params: requestParams,
          })
        } else {
          response = await axiosDefaultInstance[httpMethod]<ApiResponse<Data>>(url, requestBody)
        }

        const res: ApiResponse<Data> = response.data

        if (res && typeof res === 'object' && ('errors' in res || 'type' in res)) {
          if (form) applyAxiosFormErrors<FormValues>(res as IBaseError, form)
          else console.error(res)
          onError?.(res)
          return null
        }

        setData(res as Data)
        onSuccess?.(res as Data)
        return res as Data
      } catch (err) {
        setError(err)
        if (form && (err as AxiosError)?.response) {
          applyAxiosFormErrors<FormValues>(err, form)
        } else {
          console.error(err)
        }
        onError?.(err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [url, httpMethod, body, params, form]
  )

  useEffect(() => {
    if (enabled) execute()
  }, [enabled, httpMethod, execute])

  return { data, loading, error, execute }
}
