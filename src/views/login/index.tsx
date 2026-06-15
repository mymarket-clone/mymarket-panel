import { Button, Card, Divider, Form, Input, Alert } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { LoginCard, LoginLayout } from './style'
import { useUserStore } from '../../stores/userStore'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { useFetch } from '../../hooks/useFetch'
import { useNavigate } from 'react-router'
import type { LoginForm } from './type'
import type { User } from '../../types/User'
import { FormWrapper } from '../../style'
import { signInWithGoogle } from '../../api/googleAuth'
import { useState } from 'react'

const LoginView = () => {
  const [form] = Form.useForm<LoginForm>()
  const { setUser } = useUserStore()
  const navigate = useNavigate()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)

  const { loading, execute: login } = useFetch<User, LoginForm, Record<string, unknown>>({
    httpMethod: HttpMethod.POST,
    endpoint: 'auth/login-user',
    form: form,
    enabled: false,
  })

  const onFinish = async (values: LoginForm) => {
    login({
      body: values,
      onSuccess: (user) => {
        setUser(user)
        navigate('/attributes')
      },
    })
  }

  const onGoogleSignIn = async () => {
    if (googleLoading) return

    setGoogleLoading(true)
    setGoogleError(null)

    try {
      const user = await signInWithGoogle()
      setUser(user)
      navigate('/attributes')
    } catch (error) {
      setGoogleError(error instanceof Error ? error.message : 'Google sign-in failed.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <LoginLayout>
      <LoginCard>
        <Card title="Sign in" variant="outlined">
          <Form form={form} name="login" layout="vertical" variant="outlined" onFinish={onFinish}>
            <FormWrapper>
              <Form.Item<LoginForm>
                label="Email/Phone"
                name="emailOrPhone"
                rules={[{ required: true, message: 'Required field' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item<LoginForm>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Required field' }]}
              >
                <Input.Password />
              </Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                {loading ? 'Loading...' : 'Sign in'}
              </Button>
              <Divider plain>or</Divider>
              <Button
                icon={<GoogleOutlined />}
                loading={googleLoading}
                disabled={loading || googleLoading}
                onClick={onGoogleSignIn}
                style={{ width: '100%' }}
              >
                Continue with Google
              </Button>
              {googleError ? <Alert type="error" message={googleError} showIcon /> : null}
            </FormWrapper>
          </Form>
        </Card>
      </LoginCard>
    </LoginLayout>
  )
}

export default LoginView
