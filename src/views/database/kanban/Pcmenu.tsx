import React from 'react'

const PcMenu = () => {
  const [key, setKey] = useState(location.pathname)
  const navigate = useNavigate()

  const menu = [
    {
      id: 1,
      title: '营业额',
      path: '/database/kanban/turnover',
    },
    {
      id: 2,
      title: '收款方式',
      path: '/database/kanban/income',
    },
    {
      id: 3,
      title: '员工',
      path: '/database/kanban/employee',
    },
    {
      id: 4,
      title: '类型',
      path: '/database/kanban/saletype',
    },
    {
      id: 5,
      title: '时长',
      path: '/database/kanban/duration',
    },
  ]

  useEffect(() => {
    setKey(location.pathname)
  }, [location.pathname])

  return (
    <div className="flex flex-col w-165px">
      <p className="text-base font-600 pl-7 pb-4">报表</p>
      <div className="flex flex-col justify-center items-center">
        {menu?.map((menuItem: any) => (
          <div
            key={menuItem?.key}
            onClick={() => navigate(menuItem.path)}
            className={`w-160px text-sm cursor-pointer h-32px ${
              menuItem?.path === key ? 'bg-[#ebebed]' : ''
            }  text-color-[#171718] rounded-md flex justify-center items-center mb-4`}
          >
            {menuItem?.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PcMenu
