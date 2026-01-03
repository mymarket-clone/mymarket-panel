import { Button, Card, Form, Input } from 'antd'
import { LoginCard, LoginLayout } from './style'
import { useUserStore } from '../../stores/userStore'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { useFetch } from '../../hooks/useFetch'
import { useNavigate } from 'react-router'
import type { LoginForm } from './type'
import type { User } from '../../types/User'
import api from '../../api/api'
import { FormWrapper } from '../../style'

const LoginView = () => {
  const [form] = Form.useForm<LoginForm>()
  const { setUser } = useUserStore()
  const navigate = useNavigate()

  const { loading, execute: login } = useFetch<User, LoginForm, Record<string, unknown>>({
    httpMethod: HttpMethod.POST,
    url: api.loginUser,
    form: form,
    enabled: false,
  })

  const onFinish = async (values: LoginForm) => {
    login({
      body: values,
      onSuccess: (user) => {
        setUser(user)
        navigate('/categories')
      },
    })
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
            </FormWrapper>
          </Form>
        </Card>
      </LoginCard>
    </LoginLayout>
  )
}

export default LoginView
