import { Button, Form, ImageUploader, ImageUploadItem, TextArea } from 'antd-mobile'
import { sleep } from 'antd-mobile/es/utils/sleep'
import React from 'react'

const PersonalForm = () => {
  const [fileList, setFileList] = useState<ImageUploadItem[]>([])

  const demoSrc =
    'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'

  async function mockUpload(file: File) {
    await sleep(3000)
    return {
      url: URL.createObjectURL(file),
    }
  }

  return (
    <div className="flex h-full flex-col px-15 py-12">
      <Form requiredMarkStyle="none">
        <Form.Item name="be" layout="vertical" label="个人介绍">
          <TextArea placeholder="请输入" autoSize={{ minRows: 8, maxRows: 8 }} />
        </Form.Item>
        <div className="flex justify-between items-center pt-8">
          <p>照片&视频</p>
          <ImageUploader preview={false} onChange={setFileList} upload={mockUpload}>
            <div className="text-xs bg-[#F3F3F3] font-500 rounded-2xl px-4 py-1">上传</div>
          </ImageUploader>
        </div>
      </Form>
    </div>
  )
}

export default PersonalForm
