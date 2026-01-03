import type { FormInstance } from 'antd'
import type { NamePath } from 'antd/es/form/interface'
import { AxiosError } from 'axios'

type ApiValidationError<T extends Record<string, unknown>> = {
  errors?: Partial<Record<keyof T, string[]>>
  message?: string
}

export function applyAxiosFormErrors<T extends Record<string, unknown>>(
  error: unknown,
  form: FormInstance<T>
) {
  if (!(error instanceof AxiosError)) return

  const data = error.response?.data as ApiValidationError<T> | undefined
  if (!data) return

  if (data.errors) {
    form.setFields(
      Object.entries(data.errors).map(([field, messages]) => ({
        name: (field.charAt(0).toLowerCase() + field.slice(1)) as NamePath,
        errors: messages ?? [],
      }))
    )
  }

  if (data.message) {
    form.setFields([
      {
        name: '_form' as NamePath,
        errors: [data.message],
      },
    ])
  }
}
