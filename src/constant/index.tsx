// H5请求固定key
export const CHANNELID = `5B1DD8F3-FCF2-4F7F-8CF9-0FA3515A1D36`

// 消息来源
export const SOURCE: any = {
  1: '新预约',
  2: '已完成',
  3: '已到达',
  4: '已到达',
  5: '预约时间更改',
  6: '已取消',
  7: '工作地址更改',
  8: '渠道成本更改',
  9: '提币申请未通过',
  10: '提币申请已通过',
  11: '活动',
  12: '商户申请签约',
  13: '个人账号-签约成功',
  14: '商户账号-签约成功',
  15: '签约订单已完成待支付',
  16: '商家申请更改员工成本',
  17: '员工申请更改成本',
}

export const SOURCE_OPT: any = {
  1: '查看预约',
  2: '前往评分',
  3: '员工已到达',
  4: '发送房间号',
  6: '查看预约',
}

export const SOURCE_COLOR: any = {
  1: '#D2693F',
  2: '#2A4948',
  3: '#2A4948',
  4: '#9ECED2 ',
  6: '#406564',
}
const currentEnv = import.meta.env.MODE
// google登录授权客户端ID
export const GOOGLE_CLIENT_ID = ['development', 'test'].includes(currentEnv)
  ? '531794614018-8c2lhntpjl90f4ikopu54bsbafp8ph8h.apps.googleusercontent.com'
  : '215184588885-392rrbljtdb6164207fo95tn26dagl5e.apps.googleusercontent.com'

// google地图key
export const GOOGLE_MAP_KEY = 'AIzaSyCCBpbKOMuHO_O2156i6aBmwhHTmovrP_8'
