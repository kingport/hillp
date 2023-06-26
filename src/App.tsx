import React from 'react'
import Router from '@/routers/index'
import FooterBar from './components/FooterBar'
import { useVcosole } from './hooks/useVconsole'
import { BrowserRouter } from 'react-router-dom'
import { useMount, useRequest } from 'ahooks'
import AutoScorllTop from './utils/autoTop'
import { store } from './redux'
import MessengerApi from './http/api/messenger'
import { MessageContext, UpdateMessageContext } from './utils/message'

// 这个是全局的页面 还可以做一些其他的操作

export default function App() {
  useVcosole()

  const user_id = store.getState().global.userId

  const [number, setNumber] = useState<any>(null)
  const { run } = useRequest(() => MessengerApi.getNewMessage({}), {
    manual: true,
    onSuccess(res) {
      // res?.data
      // setNumber({ new_message: 0, pub_count: 3, ref_count: 0, sub_count: 0 })
      setNumber(res?.data)
    },
  })
  useEffect(() => {
    if (user_id) {
      run()
    }
  }, [user_id])

  return (
    <BrowserRouter>
      <AutoScorllTop>
        <MessageContext.Provider value={number}>
          <UpdateMessageContext.Provider value={setNumber}>
            <Router />
            <div className="sm:hidden">
              <FooterBar />
            </div>
          </UpdateMessageContext.Provider>
        </MessageContext.Provider>
      </AutoScorllTop>
    </BrowserRouter>
  )
}
