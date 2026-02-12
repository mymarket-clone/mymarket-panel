/* eslint-disable @typescript-eslint/no-explicit-any */
import { message, type FormInstance } from 'antd'

type Props = {
  error: any
  form: FormInstance
}

export const bindErrorToForm = ({ error, form }: Props) => {
  const response = error?.response?.data

  if (response?.errors) {
    const fields = Object.entries(response.errors).map(([key, messages]) => ({
      name: key.charAt(0).toLowerCase() + key.slice(1),
      errors: messages as string[],
    }))
    form.setFields(fields)
  } else if (response?.title) {
    message.error(response.title)
  } else {
    message.error(error?.response?.data?.message || 'Operation failed')
  }
}
