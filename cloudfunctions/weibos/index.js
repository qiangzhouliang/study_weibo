// 获取web数据
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 加载微博列表数据
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID;
  const start = event.start;

  const weiboRes = await db.collection('weibo').skip(start).limit(10).orderBy("create_time","desc").get();
  const weibos = weiboRes.data;
  if (weibos.length > 0) {
    weibos.forEach((value,index)=>{
      value.create_time = new Date(value.create_time).getTime();
      value.isPraised = false;
      if (value.praises && openId) {
        value.praises.forEach((praise,index) => {
          if (praise == openId) {
            value.isPraised = true;
          }
        })
      }
    })
  } 
  return {weibos};
}