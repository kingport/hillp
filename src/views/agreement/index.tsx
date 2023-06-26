import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import { Button, Image } from 'antd-mobile'
import React from 'react'
import LineIconLeft from '@/assets/line-left.png'

const Agreement = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col pt-[48px] pb-[90px] sm:(p-0 relative min-h-[calc(100vh-60px)])">
      <HeaderNav title="阅读条款" renderRight={false} />
      <div className="flex px-6 py-2 text-xs text-color-[#000] flex-col sm:(py-30 px-50)">
        <p className="">
          这些使用条款适用于应用程序（“应用程序”），由 M1M Media Pty Ltd 以“91UBER”（ABN 68 648 123
          639）（“我们”、“我们”或“公司”）拥有和运营，可在https://www.91uber.com/download/
          下载，其中包括所有文件、数据、代码、软件和信息。
        </p>
        <p className="font-600 pt-8">同意这些使用条款</p>
        <p>
          通过使用该应用程序，您同意受这些使用条款的约束。
          这些使用条款构成您与公司之间具有约束力的协议，并约束您对应用程序的使用。如果您不同意任何这些使用条款，则不得使用该应用程序。
        </p>
        <p className="font-600 pt-8">交易的法律能力</p>
        <p>
          如果您未满 18 岁，则不能使用该应用程序。通过使用该应用程序，您向公司声明并保证您已年满 18
          岁并且在法律上能够接受这些使用条款。
        </p>
        <p className="font-600 pt-8">范围</p>
        <p>
          该应用程序是一个移动平台，用于将成年人（“用户”）介绍给彼此以进行陪伴，他们可以但不一定在介绍之后，自行决定寻求或提供性服务。
        </p>
        <p className="font-600 pt-8">用户</p>
        <p className="pb-5">该应用程序的用户可以选择注册为服务提供商或客户。</p>
        <p className="pb-5">
          服务提供商可以通过注册个人资料来宣传陪伴，其中可能包括个人照片、兴趣、物理属性、描述、位置和其他可能不时修改或提供的详细信息（“个人资料”）。
        </p>
        <p className="pb-5">
          {`客户可以通过在应用程序上注册一个帐户来寻求陪伴。然后，他们可以通过查找他们的个人资料来预订与服务提供商的面对面介绍。他们可以通过搜索或过滤功能找到这些个人资料，该功能可以识别共同兴趣、其地理附近的服务提供商以及可​​能不时修改或提供的其他详细信息。`}
        </p>
        <p className="font-600 pt-8">身份确认</p>
        <p>在注册应用程序时，您必须向公司提供澳大利亚当局可接受的身份证明文件。这可能包括：</p>
        <p>• 澳大利亚或国际护照；</p>
        <p>• 澳大利亚驾照或学习许可证；</p>
        <p>• 外国驾照（如果是英文）；</p>
        <p>• 您所在州的航海执照； </p>
        <p>
          • Keypass 卡或其他可接受的年龄证明卡。 该身份证件必须证明您至少年满 18
          岁，并且您的姓名必须清楚地写在身份证件上。内容所有权
          您保留上传到您的个人资料中属于您的所有知识产权的所有权，包括图像。
        </p>
        <p>
          您知悉并同意，本公司不能阻止您的图像被用户和/或第三方下载、保存、操纵或以其他方式保留和/或篡改。如果您认为您的知识产权在应用程序上被恶意使用，请发送电子邮件至
        </p>
        <p>admin@91uber.com 与我们联系，我们将努力尽快删除此类内容。</p>
        <p>您授予用户非独占许可以访问和查看您上传到个人资料的内容。</p>
        <p>
          您授予公司可许可的、可转让的、永久的、不可撤销的、非排他性的全球许可，以使用、复制、发布、编辑、翻译、分发、公开展示和制作您个人资料中所有内容（包括图像）的衍生作品，用于与应用程序相关的使用，包括但不限于通过任何媒体渠道以任何媒体格式推广和重新分发部分或全部应用程序和相关产品。
        </p>
      </div>
      <div className="fixed-b-btn flex sm:(absolute bottom-0)">
        <div className="flex items-center w-full px-6 justify-between sm:(justify-end)">
          <div className="flex items-center">
            <SvgIcon name="radio-checked" className="w-[12px] h-[12px]" />
            <p className="text-xs pl-2">已阅读《HIILP使用条款》</p>
          </div>
          <Button
            onClick={() => navigate('/pay')}
            className="h-[2.68rem] w-[40%] rounded-3xl sm:(w-200px ml-10)"
            type="submit"
            color="primary"
            loadingIcon={<></>}
          >
            同意并继续
          </Button>
        </div>
      </div>
      <div
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer items-center <sm:(hidden) font-600 fixed top-30 left-40"
      >
        <Image src={LineIconLeft} className="mr-4 w-30px" />
        返回
      </div>
    </div>
  )
}

export default Agreement
