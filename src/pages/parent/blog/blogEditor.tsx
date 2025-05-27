import React, { useState } from 'react'
import { Form, Input, Select, Button, Upload, Modal, Divider, Radio, Tabs, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface ContentSection {
  type: 'text' | 'header' | 'image';
  content: string;
  level?: 1 | 2 | 3; // For headers: 1=large, 2=medium, 3=small
  imagePosition?: 'left' | 'center' | 'right' | 'full';
  imageUrl?: string;
}

interface BlogEditorProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (blogData: any) => void;
  categories: { name: string; count: number }[];
}

const BlogEditor: React.FC<BlogEditorProps> = ({ visible, onClose, onSubmit, categories }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    { type: 'text', content: '' }
  ]);
  const [additionalImages, setAdditionalImages] = useState<UploadFile[]>([]);

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const completePost = {
          ...values,
          contentSections,
          additionalImages
        };
        
        const hasContent = contentSections.some(section => section.content.trim() !== '');
        
        if (!hasContent) {
          message.error('Bài viết cần có ít nhất một đoạn nội dung');
          return;
        }
        
        const imageSections = contentSections.filter(section => section.type === 'image');
        const missingImages = imageSections.some(section => !section.imageUrl);
        
        if (missingImages) {
          message.error('Vui lòng tải lên hình ảnh cho tất cả các phần hình ảnh hoặc xóa chúng');
          return;
        }
        
        onSubmit(completePost);
        resetForm();
      })
      .catch(() => {
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      });
  };

  const resetForm = () => {
    form.resetFields();
    setFileList([]);
    setContentSections([{ type: 'text', content: '' }]);
    setAdditionalImages([]);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const addSection = (type: ContentSection['type']) => {
    const newSection: ContentSection = { 
      type, 
      content: '',
      ...(type === 'header' && { level: 2 }),
      ...(type === 'image' && { imagePosition: 'center' })
    };
    setContentSections([...contentSections, newSection]);
  };

  const updateSection = (index: number, field: string, value: any) => {
    const updatedSections = [...contentSections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    setContentSections(updatedSections);
  };

  const removeSection = (index: number) => {
    const updatedSections = [...contentSections];
    updatedSections.splice(index, 1);
    if (updatedSections.length === 0) {
      updatedSections.push({ type: 'text', content: '' });
    }
    setContentSections(updatedSections);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      title={<div className="text-center text-4xl font-bold mt-5 mb-5">Bài viết của bạn</div>}
      centered
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto', padding: '24px' }}
    >
      <Tabs defaultActiveKey="basic" className="mb-6">
        <TabPane tab={<span className="text-base">Thông tin cơ bản</span>} key="basic">
          <Form
            form={form}
            layout="vertical"
            className="px-4"
          >
            <Form.Item
              label={<span className="text-base">Tiêu đề</span>}
              name="title"
              rules={[{ required: true, message: 'Hãy nhập tiêu đề bài viết!' }]}
            >
              <Input size="large" placeholder="Nhập tiêu đề bài viết của bạn" className="text-base" />
            </Form.Item>
            
            <Form.Item
              label={<span className="text-base">Tóm tắt</span>}
              name="excerpt"
              rules={[{ required: true, message: 'Hãy nhập tóm tắt bài viết!' }]}
            >
              <TextArea rows={3} placeholder="Nhập tóm tắt bài viết" className="text-base" />
            </Form.Item>
            
            <Form.Item
              label={<span className="text-base">Danh mục</span>}
              name="category"
              rules={[{ required: true, message: 'Hãy chọn danh mục!' }]}
            >
              <Select placeholder="Chọn danh mục" className="text-base">
                {categories.map((category, index) => (
                  <Option key={index} value={category.name}>{category.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              label={<span className="text-base">Ảnh bìa</span>}
              name="coverImage"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Hãy chọn ảnh bìa cho bài viết!' }]}
            >
              <Upload 
                listType="picture-card"
                maxCount={1}
                fileList={fileList}
                onChange={({fileList}) => setFileList(fileList)}
                beforeUpload={() => false}
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            
            <Form.Item
              label={<span className="text-base">Trích dẫn</span>}
              name="quote"
              extra={<span className="text-sm">Sẽ được hiển thị dưới dạng trích dẫn trong bài viết</span>}
            >
              <TextArea rows={3} placeholder="Thêm một câu nói đáng nhớ từ bài viết của bạn (không bắt buộc)" className="text-base" />
            </Form.Item>
          </Form>
        </TabPane>
        
        <TabPane tab={<span className="text-base">Nội dung</span>} key="content">
          <div className="px-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Nội dung bài viết</h3>
              
              {contentSections.map((section, index) => (
                <div key={index} className="mb-6 border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      {section.type === 'text' && 'Đoạn văn'}
                      {section.type === 'header' && 'Tiêu đề phụ'}
                      {section.type === 'image' && 'Hình ảnh'}
                    </div>
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => removeSection(index)}
                      disabled={contentSections.length === 1}
                    />
                  </div>
                  
                  {section.type === 'text' && (
                    <TextArea 
                      rows={4}
                      value={section.content}
                      onChange={(e) => updateSection(index, 'content', e.target.value)}
                      placeholder="Nhập nội dung đoạn văn"
                      className="text-base"
                    />
                  )}
                  
                  {section.type === 'header' && (
                    <div className="space-y-3">
                      <div>
                        <Radio.Group 
                          value={section.level} 
                          onChange={(e) => updateSection(index, 'level', e.target.value)}
                        >
                          <Radio value={1}>Lớn</Radio>
                          <Radio value={2}>Vừa</Radio>
                          <Radio value={3}>Nhỏ</Radio>
                        </Radio.Group>
                      </div>
                      <Input 
                        value={section.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                        placeholder="Nhập tiêu đề phụ"
                        className="text-base"
                      />
                    </div>
                  )}
                  
                  {section.type === 'image' && (
                    <div className="space-y-3">
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        fileList={section.imageUrl ? [{ uid: index.toString(), url: section.imageUrl, name: 'image.png', status: 'done' } as any] : []}
                        onChange={(info) => {
                          if (info.fileList.length > 0) {
                            // In a real app, you'd upload the image and get a URL
                            const fakeUrl = URL.createObjectURL(info.fileList[0].originFileObj as Blob);
                            updateSection(index, 'imageUrl', fakeUrl);
                          } else {
                            updateSection(index, 'imageUrl', '');
                          }
                        }}
                        beforeUpload={() => false}
                      >
                        {!section.imageUrl && (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải lên</div>
                          </div>
                        )}
                      </Upload>
                      
                      <div>
                        <div className="mb-1 font-medium">Vị trí hình ảnh:</div>
                        <Radio.Group 
                          value={section.imagePosition} 
                          onChange={(e) => updateSection(index, 'imagePosition', e.target.value)}
                        >
                          <Radio value="left">Trái</Radio>
                          <Radio value="center">Giữa</Radio>
                          <Radio value="right">Phải</Radio>
                          <Radio value="full">Toàn màn hình</Radio>
                        </Radio.Group>
                      </div>
                      
                      <Input 
                        value={section.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                        placeholder="Mô tả hình ảnh (không bắt buộc)"
                        className="text-base"
                      />
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button onClick={() => addSection('text')} icon={<PlusOutlined />} className="text-base">
                  Thêm đoạn văn
                </Button>
                <Button onClick={() => addSection('header')} icon={<PlusOutlined />} className="text-base">
                  Thêm tiêu đề
                </Button>
                <Button onClick={() => addSection('image')} icon={<PlusOutlined />} className="text-base">
                  Thêm hình ảnh
                </Button>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
      
      <Divider />
      
      <div className="flex justify-center mt-6">
        <Button 
          type="primary" 
          onClick={handleSubmit}
          size="large"
          className="bg-blue-500 hover:bg-blue-600 px-8 text-base"
        >
          Đăng bài viết
        </Button>
      </div>
    </Modal>
  );
};

export default BlogEditor; 