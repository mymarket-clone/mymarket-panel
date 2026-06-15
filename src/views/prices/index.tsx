import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Col, InputNumber, message, Popconfirm, Row, Select, Space, Switch, Table, Tabs, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { axiosDefaultInstance } from '../../api/axios'
import { useFetch } from '../../hooks/useFetch'
import { HttpMethod } from '../../types/enums/HttpMethod'
import { ListingServiceType, type ListingServicePrice } from './type'

const { Text, Title } = Typography

const serviceOrder = [
  ListingServiceType.Vip,
  ListingServiceType.VipPlus,
  ListingServiceType.SuperVip,
  ListingServiceType.Color,
  ListingServiceType.AutoRenewal,
]

const serviceLabels: Record<ListingServiceType, string> = {
  [ListingServiceType.Vip]: 'VIP',
  [ListingServiceType.VipPlus]: 'VIP+',
  [ListingServiceType.SuperVip]: 'Super VIP',
  [ListingServiceType.Color]: 'Color',
  [ListingServiceType.AutoRenewal]: 'Auto renewal',
}

const formatMoney = (value: number) => value.toFixed(2)
const dayRange = (row: ListingServicePrice) => `${row.fromDay}-${row.toDay} days`

const PricesView = () => {
  const { data: initialData, loading } = useFetch<ListingServicePrice[]>({
    httpMethod: HttpMethod.GET,
    endpoint: 'prices/admin',
  })

  const [savedData, setSavedData] = useState<ListingServicePrice[]>([])
  const [draftData, setDraftData] = useState<ListingServicePrice[]>([])
  const [activeService, setActiveService] = useState<ListingServiceType>(ListingServiceType.Vip)
  const [savingService, setSavingService] = useState<ListingServiceType | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [previewService, setPreviewService] = useState<ListingServiceType>(ListingServiceType.Vip)
  const [previewDays, setPreviewDays] = useState<number | null>(1)
  const [nextDraftId, setNextDraftId] = useState(-1)

  useEffect(() => {
    const next = initialData ?? []
    setSavedData(next)
    setDraftData(next)
  }, [initialData])

  const updateTier = (id: number, patch: Partial<ListingServicePrice>) => {
    setDraftData((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  const addTier = (serviceType: ListingServiceType) => {
    const rows = tiersForService(serviceType)
    const lastRow = rows.at(-1)
    const fromDay = lastRow ? lastRow.toDay + 1 : 1
    const pricePerDay = lastRow?.pricePerDay ?? originalPriceForService(serviceType)

    setDraftData((prev) => [
      ...prev,
      {
        id: nextDraftId,
        serviceType,
        fromDay,
        toDay: fromDay,
        pricePerDay,
        originalPricePerDay: null,
        isActive: true,
      },
    ])
    setNextDraftId((prev) => prev - 1)
  }

  const removeTier = (id: number) => {
    setDraftData((prev) => prev.filter((row) => row.id !== id))
  }

  const tiersForService = (serviceType: ListingServiceType, source = draftData) =>
    source
      .filter((row) => row.serviceType === serviceType)
      .sort((a, b) => a.fromDay - b.fromDay || a.toDay - b.toDay)

  const originalPriceForService = (serviceType: ListingServiceType) => {
    const activePrices = tiersForService(serviceType)
      .filter((row) => row.isActive)
      .map((row) => row.pricePerDay)

    const prices = activePrices.length
      ? activePrices
      : tiersForService(serviceType).map((row) => row.pricePerDay)

    return Math.max(...prices, 0)
  }

  const validateService = (serviceType: ListingServiceType) => {
    const errors: string[] = []
    const rows = tiersForService(serviceType)

    if (!rows.length) {
      errors.push('At least one tier is required.')
    }

    rows.forEach((row, index) => {
      const label = `Tier ${index + 1}`

      if (!row.fromDay) errors.push(`${label}: min days is required.`)
      if (!row.toDay) errors.push(`${label}: max days is required.`)
      if (row.fromDay && row.toDay && row.fromDay > row.toDay) {
        errors.push(`${label}: min days must be less than or equal to max days.`)
      }
      if (row.pricePerDay == null || Number.isNaN(Number(row.pricePerDay))) {
        errors.push(`${label}: price per day is required.`)
      } else if (row.pricePerDay < 0) {
        errors.push(`${label}: price per day must be greater than or equal to 0.`)
      }
    })

    const sorted = [...rows].sort((a, b) => a.fromDay - b.fromDay || a.toDay - b.toDay)
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].fromDay <= sorted[i - 1].toDay) {
        errors.push(`Day ranges overlap: ${dayRange(sorted[i - 1])} and ${dayRange(sorted[i])}.`)
      }
    }

    return errors
  }

  const saveService = async (serviceType: ListingServiceType) => {
    const errors = validateService(serviceType)
    setValidationErrors(errors)

    if (errors.length) return

    const tiers = tiersForService(serviceType).map((row) => ({
      id: row.id,
      fromDay: row.fromDay,
      toDay: row.toDay,
      pricePerDay: row.pricePerDay,
      isActive: row.isActive,
    }))

    try {
      setSavingService(serviceType)
      const { data: savedRows } = await axiosDefaultInstance.put<ListingServicePrice[]>(`prices/services/${serviceType}`, {
        serviceType,
        tiers,
      })
      setSavedData((prev) => [...prev.filter((row) => row.serviceType !== serviceType), ...savedRows])
      setDraftData((prev) => [...prev.filter((row) => row.serviceType !== serviceType), ...savedRows])
      message.success(`${serviceLabels[serviceType]} prices updated`)
    } catch (error: any) {
      const response = error?.response?.data
      const serverMessage =
        response?.message || response?.title || Object.values(response?.errors ?? {}).flat().join(' ')
      message.error(serverMessage || 'Update failed')
    } finally {
      setSavingService(null)
    }
  }

  const cancelService = (serviceType: ListingServiceType) => {
    const savedRows = tiersForService(serviceType, savedData)
    setDraftData((prev) => [...prev.filter((row) => row.serviceType !== serviceType), ...savedRows])
    setValidationErrors([])
  }

  const preview = useMemo(() => {
    if (!previewDays) return null

    const row = tiersForService(previewService).find(
      (tier) => tier.isActive && previewDays >= tier.fromDay && previewDays <= tier.toDay
    )

    if (!row) return null

    const total = row.pricePerDay * previewDays
    const originalTotal = originalPriceForService(previewService) * previewDays

    return {
      tier: row,
      total,
      originalTotal,
      discount: Math.max(originalTotal - total, 0),
    }
  }, [draftData, previewDays, previewService])

  const columns = [
    {
      title: 'Min days',
      dataIndex: 'fromDay',
      key: 'fromDay',
      width: 140,
      render: (value: number, row: ListingServicePrice) => (
        <InputNumber
          min={1}
          precision={0}
          value={value}
          onChange={(next) => updateTier(row.id, { fromDay: Number(next ?? 0) })}
        />
      ),
    },
    {
      title: 'Max days',
      dataIndex: 'toDay',
      key: 'toDay',
      width: 140,
      render: (value: number, row: ListingServicePrice) => (
        <InputNumber
          min={1}
          precision={0}
          value={value}
          onChange={(next) => updateTier(row.id, { toDay: Number(next ?? 0) })}
        />
      ),
    },
    {
      title: 'Price / day',
      dataIndex: 'pricePerDay',
      key: 'pricePerDay',
      width: 170,
      render: (value: number, row: ListingServicePrice) => (
        <InputNumber
          min={0}
          precision={2}
          value={value}
          formatter={(next) => `${next}`}
          onChange={(next) => updateTier(row.id, { pricePerDay: Number(next ?? 0) })}
        />
      ),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 110,
      render: (value: boolean, row: ListingServicePrice) => (
        <Switch checked={value} onChange={(checked) => updateTier(row.id, { isActive: checked })} />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 90,
      render: (_: unknown, row: ListingServicePrice) => (
        <Popconfirm
          title="Delete this tier?"
          okText="Delete"
          okButtonProps={{ danger: true }}
          onConfirm={() => removeTier(row.id)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ]

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} xl={17}>
        <Card
          title="Listing service prices"
          extra={
            <Space>
              <Button onClick={() => cancelService(activeService)}>Cancel</Button>
              <Button
                type="primary"
                loading={savingService === activeService}
                onClick={() => saveService(activeService)}
              >
                Save
              </Button>
            </Space>
          }
        >
          {validationErrors.length > 0 && (
            <Alert
              type="error"
              showIcon
          style={{ marginBottom: 16 }}
          message="Please fix pricing validation errors"
              description={
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              }
            />
          )}

          <Tabs
            activeKey={String(activeService)}
            onChange={(key) => {
              setActiveService(Number(key) as ListingServiceType)
              setValidationErrors([])
            }}
            items={serviceOrder.map((serviceType) => ({
              key: String(serviceType),
              label: serviceLabels[serviceType],
              children: (
                <Table
                  bordered
                  dataSource={tiersForService(serviceType)}
                  loading={loading}
                  rowKey="id"
                  pagination={false}
                  columns={columns}
                  title={() => (
                    <Row justify="space-between" align="middle">
                      <Text type="secondary">Ranges are inclusive. Use 1-15 and 16-30 when splitting a tier.</Text>
                      <Button icon={<PlusOutlined />} onClick={() => addTier(serviceType)}>
                        Add tier
                      </Button>
                    </Row>
                  )}
                />
              ),
            }))}
          />
        </Card>
      </Col>

      <Col xs={24} xl={7}>
        <Card title="Preview calculator">
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Text strong>Service</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                value={previewService}
                options={serviceOrder.map((serviceType) => ({
                  value: serviceType,
                  label: serviceLabels[serviceType],
                }))}
                onChange={setPreviewService}
              />
            </div>

            <div>
              <Text strong>Number of days</Text>
              <InputNumber
                min={1}
                precision={0}
                style={{ width: '100%', marginTop: 8 }}
                value={previewDays}
                onChange={(next) => setPreviewDays(next == null ? null : Number(next))}
              />
            </div>

            {preview ? (
              <Card size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text type="secondary">Matched range: {dayRange(preview.tier)}</Text>
                  <Row justify="space-between">
                    <Text>Total price</Text>
                    <Text strong>{formatMoney(preview.total)} GEL</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text>Original total</Text>
                    <Text>{formatMoney(preview.originalTotal)} GEL</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text>Discount</Text>
                    <Text type={preview.discount > 0 ? 'success' : undefined}>
                      {formatMoney(preview.discount)} GEL
                    </Text>
                  </Row>
                </Space>
              </Card>
            ) : (
              <Alert
                type="warning"
                showIcon
                message="No active tier matches the selected service and number of days."
              />
            )}

            <Title level={5} style={{ marginBottom: 0 }}>
              Current draft tiers
            </Title>
            <Text type="secondary">
              Original/day is derived from the highest active tier: {formatMoney(originalPriceForService(previewService))} GEL/day
            </Text>
            <Space direction="vertical" size={8}>
              {tiersForService(previewService).map((row) => (
                <Text key={row.id} type={row.isActive ? undefined : 'secondary'}>
                  {dayRange(row)}: {formatMoney(row.pricePerDay)} GEL/day
                  {!row.isActive ? ' - inactive' : ''}
                </Text>
              ))}
            </Space>
          </Space>
        </Card>
      </Col>
    </Row>
  )
}

export default PricesView
