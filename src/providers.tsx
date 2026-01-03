import { ConfigProvider, theme } from 'antd'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.compactAlgorithm,
        token: {
          colorPrimary: '#FFD102',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default Providers
