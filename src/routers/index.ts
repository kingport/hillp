import React from 'react'
import { rootRouter } from './router'
import { useRoutes } from 'react-router-dom'
// export default Router = routes
// export const rootRouter = routes
const Router: any = () => {
  // TODO: 路由处理
  const routes = useRoutes(rootRouter)
  return routes
}
export default Router
