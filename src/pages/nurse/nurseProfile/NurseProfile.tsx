import React from 'react'
import { Card, Form, Input, Button } from 'antd'

const NurseProfile: React.FC = () => {
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Hồ sơ cá nhân</h2>
      <Card>
        <Form layout='vertical'>
          <Form.Item label='Họ và tên' name='name'>
            <Input />
          </Form.Item>
          <Form.Item label='Email' name='email'>
            <Input />
          </Form.Item>
          <Form.Item label='Số điện thoại' name='phone'>
            <Input />
          </Form.Item>
          <Form.Item label='Địa chỉ' name='address'>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' className='bg-blue-500'>
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default NurseProfile
