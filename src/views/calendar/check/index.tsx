import React, { RefObject } from 'react'
import moment from 'moment'
import HeaderNav from '@/components/HeaderNav'
import PickerContent from '../components/PickerContent'
import { Button, Form, Checkbox, TextArea, Picker, DatePicker, PickerRef } from 'antd-mobile'
import { useRequest } from 'ahooks'
import CalendarApi from '@/http/api/calendar'
import ManageApi from '@/http/api/manage'
import { store } from '@/redux'
import Ellipseing from '@/components/Ellipseing'
import { getWeek } from '@/utils/util'
import { Skeleton } from 'antd'
import HiilpActionSheet from '@/components/HiilpActionSheet'

function AddBreakForm() {
  const navigate = useNavigate()
  const location: any = useLocation()
  const userInfo = store.getState().global.userInfo

  const id = location?.state?.id

  const { data: res, loading } = useRequest((params) => CalendarApi.getRest({ id }))
  const { runAsync: restDelete } = useRequest((params) => CalendarApi.restDelete(params), {
    manual: true,
    onSuccess() {
      navigate('/calendar')
    },
  })

  const [sheetVisible, setSheetVisible] = useState(false)

  if (loading) return <Skeleton />

  return (
    <div className={`pt-[48px] pb-[90px]`}>
      <HeaderNav renderLeft={false} />
      <div className="flex flex-col px-10 py-12">
        <p className="text-2xl font-600 pb-10">休息时间</p>

        <div className="flex items-center">
          <p className="pr-4 text-color-[#000] text-xs font-500">日期</p>
          <p className="text-sm">
            {getWeek(moment(res?.data?.start_time * 1000))}&nbsp;
            {moment(res?.data?.start_time * 1000).format('YYYY/MM/DD')}
          </p>
        </div>

        <div className="flex items-center pt-4">
          <p className="pr-4 text-color-[#000] text-xs font-500">员工</p>
          <p className="text-sm">{res?.data?.staff_name}</p>
        </div>

        <div className="flex items-center pt-4">
          <p className="pr-4 text-color-[#000] text-xs font-500">时间</p>
          <p className="text-sm">
            {moment(res?.data?.start_time * 1000).format('HH:mm')}-{moment(res?.data?.end_time * 1000).format('HH:mm')}
          </p>
        </div>

        <div className="flex items-center pt-4">
          <p className="pr-4 text-color-[#000] text-xs font-500">备注</p>
          <p className="text-sm">{res?.data?.remark || '--'}</p>
        </div>

        {res?.data?.is_update === 1 && (
          <div className="fixed-b-btn flex justify-around">
            <Button
              className="w-[45%] h-[2.75rem] rounded-3xl"
              loading="auto"
              loadingIcon={<Ellipseing />}
              onClick={() => {
                // await restDelete({
                //   id: id,
                // })
                setSheetVisible(true)
              }}
            >
              删除
            </Button>
            <Button
              className="w-[45%] h-[2.75rem] rounded-3xl"
              type="submit"
              color="primary"
              onClick={() => {
                navigate('/calendar/add/break', {
                  state: {
                    restId: id,
                  },
                })
              }}
              loadingIcon={<Ellipseing />}
            >
              编辑
            </Button>
          </div>
        )}
      </div>
      <HiilpActionSheet
        actions={[
          {
            text: '删除休息时间',
            key: 'delete',
            danger: true,
            onClick: async () => {
              await restDelete({
                id: id,
              })
              setSheetVisible(false)
            },
          },
        ]}
        visible={sheetVisible}
        setVisible={setSheetVisible}
      />
    </div>
  )
}

export default AddBreakForm
