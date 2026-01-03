import { Table, Spin, Drawer, Button, Form, Input, TreeSelect } from 'antd'
import { useElementSize } from '@custom-react-hooks/use-element-size'
import { FormWrapper, PageWrapper } from '../../style'
import { columns } from './columns'
import { useCategories } from './useCategories'

const CategoriesView = () => {
  const [ref, size] = useElementSize()

  const {
    form,
    normalizedCategories,
    categoriesLoading,
    buildTreeSelectData,
    catLoading,
    editCategoryLoading,
    drawerOpen,
    expandedKeys,
    setExpandedKeys,
    openDrawer,
    closeDrawer,
    handleEdit,
    handleDelete,
    openDrawerToAdd,
    handleAdd,
    currentEditingCategory,
    addCategoryLoading,
  } = useCategories()

  if (categoriesLoading) return <Spin />

  return (
    <PageWrapper ref={ref}>
      <Table
        columns={columns({
          handleOpenDrawer: openDrawer,
          handleDelete,
          handleAdd: openDrawerToAdd,
        })}
        dataSource={normalizedCategories ?? []}
        pagination={false}
        scroll={{ y: size.height - 80 }}
        expandable={{
          childrenColumnName: 'children',
          expandRowByClick: true,
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys) => setExpandedKeys([...keys]),
        }}
      />

      <Drawer
        closable
        destroyOnHidden
        title={currentEditingCategory !== null ? 'Edit Category' : 'Add Category'}
        placement="right"
        open={drawerOpen}
        loading={catLoading}
        onClose={closeDrawer}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            if (currentEditingCategory !== null) handleEdit(values)
            else handleAdd(values)
          }}
        >
          <FormWrapper>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Required field' }]}>
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item label="NameEn" name="nameEn">
              <Input placeholder="English name" />
            </Form.Item>

            <Form.Item label="NameRu" name="nameRu">
              <Input placeholder="Russian name" />
            </Form.Item>

            <Form.Item label="ParentId" name="parentId">
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                placeholder="Please select"
                allowClear
                treeDefaultExpandAll
                treeData={buildTreeSelectData(normalizedCategories)}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {currentEditingCategory !== null
                ? editCategoryLoading
                  ? 'Loading...'
                  : 'Edit'
                : addCategoryLoading
                  ? 'Loading...'
                  : 'Add'}
            </Button>
          </FormWrapper>
        </Form>
      </Drawer>
    </PageWrapper>
  )
}

export default CategoriesView
