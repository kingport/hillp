import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import InformationApi from '@/http/api/information'
import { useRequest } from 'ahooks'
import { Button, Picker, Toast, Image } from 'antd-mobile'
import { Select, Dropdown } from 'antd'
import React from 'react'
import type { MenuProps } from 'antd'
import PersonalApi from '@/http/api/personal'
import { store } from '@/redux'
import { CloseOutline } from 'antd-mobile-icons'

const Info = () => {
  const navigate = useNavigate()
  const [nation, setCountry] = useState('')
  const [nationLog, setCountryLog] = useState('')

  const [set_lang, setLang] = useState('')
  const [set_langLogo, setLangLogo] = useState('')

  const [timezone, setTimeZone] = useState('')
  const [timezoneLogo, setTimeZoneLogo] = useState('')

  const userInfo = store.getState().global.userInfo
  const { run } = useRequest((params) => PersonalApi.systemSetting(params), {
    manual: true,
    onSuccess(res) {
      Toast.show(res.msg)
    },
  })

  // 国家
  const { data: resCountry } = useRequest(() => InformationApi.getInformationList({ type: 4, is_system: 1 }), {
    onSuccess(res) {
      setCountry(userInfo?.nation || res?.data[0].label)
      setCountryLog(res?.data[0].logo)
    },
  })
  // 语言
  const { data: resLang } = useRequest(() => InformationApi.getInformationList({ type: 8, is_system: 1 }), {
    onSuccess(res) {
      setLang(resLang?.data?.find((item: any) => item?.value == userInfo?.lang)?.label || res?.data[0].label)
      setLangLogo(res?.data[0].logo)
    },
  })
  // 时区
  const { data: resTimeZone } = useRequest(() => InformationApi.getInformationList({ type: 5 }), {
    onSuccess(res) {
      setTimeZone(userInfo?.timezone || res?.data[0].label)
      setTimeZoneLogo(res?.data[0].logo)
    },
  })

  const selelctCountry = async () => {
    const value = await Picker.prompt({
      columns: [resCountry?.data],
    })
    if (value) {
      setCountry(resCountry?.data?.find((item: any) => item?.value == value)?.label)
      setCountryLog(resCountry?.data?.find((item: any) => item?.value == value)?.logo)
    }
  }

  const selelctLang = async () => {
    const value = await Picker.prompt({
      columns: [resLang?.data],
    })
    if (value) {
      setLang(resLang?.data?.find((item: any) => item?.value == value)?.label)
      setLangLogo(resLang?.data?.find((item: any) => item?.value == value)?.logo)
    }
  }

  const selelctTimeZone = async () => {
    const value = await Picker.prompt({
      columns: [resTimeZone?.data],
    })
    if (value) {
      setTimeZone(resTimeZone?.data?.find((item: any) => item?.value == value)?.label)
      setTimeZoneLogo(resTimeZone?.data?.find((item: any) => item?.value == value)?.logo)
    }
  }

  // --------pc-----start-----

  const onClick: MenuProps['onClick'] = ({ key }) => {
    const index = key.match(/-(.*)/)?.[1]
    const value = resCountry?.data[`${index}`].value
    setCountry(resCountry?.data?.find((item: any) => String(item?.value) == value)?.label)
  }

  const onClickLang: MenuProps['onClick'] = ({ key }) => {
    const index = key.match(/-(.*)/)?.[1]
    const value = resLang?.data[`${index}`].value
    setLang(resLang?.data?.find((item: any) => String(item?.value) == value)?.label)
  }

  const onClickTimes: MenuProps['onClick'] = ({ key }) => {
    const index = key.match(/-(.*)/)?.[1]
    const value = resTimeZone?.data[`${index}`].value
    setTimeZone(resTimeZone?.data?.find((item: any) => String(item?.value) == value)?.label)
  }

  // --------pc-----end----

  const items = resCountry?.data
  const itemsLang = resLang?.data
  const itemsTimes = resTimeZone?.data

  return (
    <div className="flex flex-col pt-[48px] pb-[90px] sm:(w-300px items-center justify-center pt-0)">
      <HeaderNav title="系统设置" renderRight={false} border />
      <div className="flex flex-col mt-8 px-14 py-10 sm:(p-0 w-full)">
        {/* <div className="flex items-center">
          <p className="text-sm pr-4 text-color-[#000]">国家</p>
          <Dropdown className="sm:(block) hidden" trigger={['click']} menu={{ items, onClick }} placement="bottom">
            <a
              onClick={(e) => e.preventDefault()}
              className="flex justify-between items-cente flex-1 bg-[#f7f7f7] rounded-3xl"
            >
              <div className="flex justify-between items-center px-6 flex-1 py-2.5 bg-[#f7f7f7] rounded-3xl">
                <div className="flex items-center">
                  <SvgIcon name="australia" className="w-[15px] h-[12px]" />
                  <p className="pl-4 text-xs">{nation}</p>
                </div>
                <SvgIcon name="phone-bottom" className="w-[10px] h-[6px]" />
              </div>
            </a>
          </Dropdown>
          <div
            onClick={selelctCountry}
            className="sm:(hidden) flex justify-between items-center px-6 flex-1 py-2.5 bg-[#f7f7f7] rounded-3xl"
          >
            <div className="flex items-center">
              {nationLog && <Image src={nationLog} className="w-[15px] h-[12px]" />}
              <p className="pl-4 text-xs">{nation}</p>
            </div>
            <SvgIcon name="phone-bottom" className="w-[10px] h-[6px]" />
          </div>
        </div>
        <div className="flex items-center mt-6">
          <p className="text-sm pr-4 opacity-0 text-color-[#000]">说明</p>
          <div onClick={selelctCountry} className="flex items-center flex-1 px-2 py-2.5 bg-[#f7f7f7] rounded-lg">
            <p className="text-xs text-color-[#000]">
              {resCountry?.data[0]?.remark}
              <a className="underline text-color-[#2A4948]">客服</a>
            </p>
          </div>
        </div> */}
        <div className="flex items-center mt-6">
          <p className="text-sm pr-4 text-color-[#000]">语言</p>
          {/* pc */}
          <Dropdown
            className="sm:(block) hidden"
            trigger={['click']}
            menu={{ items: itemsLang, onClick: onClickLang }}
            placement="bottom"
          >
            <a
              onClick={(e) => e.preventDefault()}
              className="flex justify-between items-cente flex-1 bg-[#f7f7f7] rounded-3xl"
            >
              <div className="flex justify-between items-center px-6 flex-1 py-2.5 bg-[#f7f7f7] rounded-3xl">
                <div className="flex items-center">
                  {/* <SvgIcon name="australia" className="w-[15px] h-[12px]" /> */}
                  {set_langLogo && <Image src={set_langLogo} className="w-[15px] h-[12px]" />}
                  <p className="pl-4 text-xs">{set_lang}</p>
                </div>
                <SvgIcon name="phone-bottom" className="w-[10px] h-[6px]" />
              </div>
            </a>
          </Dropdown>
          {/* h5 */}
          <div
            onClick={selelctLang}
            className="sm:(hidden) flex justify-between items-center px-6 flex-1 py-2.5 bg-[#f7f7f7] rounded-3xl"
          >
            <div className="flex items-center">
              {set_langLogo && <Image src={set_langLogo} className="w-[15px] h-[12px]" />}
              <p className="pl-4 text-xs">{set_lang}</p>
            </div>
            <SvgIcon name="phone-bottom" className="w-[10px] h-[6px]" />
          </div>
        </div>
        <div className="flex items-center mt-6">
          <p className="text-sm pr-4 text-color-[#000]">时区</p>
          {/* pc */}
          <Dropdown
            className="sm:(block) hidden"
            trigger={['click']}
            menu={{ items: itemsTimes, onClick: onClickTimes }}
            placement="bottom"
          >
            <a
              onClick={(e) => e.preventDefault()}
              className="flex justify-between items-cente flex-1 bg-[#f7f7f7] rounded-3xl"
            >
              <div className="flex justify-between items-center px-6 flex-1 py-2.5 bg-[#f7f7f7] rounded-3xl">
                <div className="flex items-center">
                  {/* <SvgIcon name="australia" className="w-[15px] h-[12px]" /> */}
                  {/* {set_langLogo && <Image src={set_langLogo} className="w-[15px] h-[12px]" />} */}
                  {timezoneLogo && <Image src={timezoneLogo} className="w-[15px] h-[12px]" />}
                  <p className="pl-4 text-xs">{timezone}</p>
                </div>
                <SvgIcon name="phone-bottom" className="w-[10px] h-[6px]" />
              </div>
            </a>
          </Dropdown>
          <div
            onClick={selelctTimeZone}
            className="sm:(hidden) flex justify-between items-center px-6 flex-1 py-2.5 bg-[#f7f7f7] rounded-3xl"
          >
            <div className="flex items-center">
              {timezoneLogo && <Image src={timezoneLogo} className="w-[15px] h-[12px]" />}
              <p className="pl-4 text-xs">{timezone}</p>
            </div>
            <SvgIcon name="phone-bottom" className="w-[10px] h-[6px]" />
          </div>
        </div>
      </div>
      <div className="flex justify-around <sm:(fixed-b-btn) sm:(w-full mt-20)">
        <Button
          onClick={() => navigate(-1)}
          className="w-[30%] border-0 bg-[#F3F3F3] sm:(w-[40%])"
          shape="rounded"
          block
          size="large"
        >
          取消
        </Button>
        <Button
          className="w-[30%] sm:(w-[40%])"
          shape="rounded"
          block
          type="submit"
          size="large"
          color="primary"
          onClick={() => {
            const nationValue = resCountry?.data.find((item: any) => item.label === nation)?.value
            const langValue = resLang?.data.find((item: any) => item.label === set_lang)?.value
            run({ type: 1, timezone, set_lang: langValue })
          }}
          loadingIcon={<></>}
        >
          确认
        </Button>
      </div>
      <div onClick={() => navigate(-1)} className="fixed top-80px right-40px <sm:(hidden)">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default Info
