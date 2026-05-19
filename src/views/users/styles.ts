import styled from '@emotion/styled'

export const UsersToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
  }
`
