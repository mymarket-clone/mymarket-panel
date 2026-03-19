/* eslint-disable @typescript-eslint/no-explicit-any */
export const toFormData = (values: any) => {
  const fd = new FormData()

  Object.entries(values).forEach(([k, v]) => {
    if (v === undefined || v === null) return

    if (v instanceof File) {
      fd.append(k, v)
      return
    }

    fd.append(k, String(v))
  })

  return fd
}
