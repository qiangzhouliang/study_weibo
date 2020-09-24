// 点赞云函数
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID;
  const weiboId = event.weiboId;
  const praise = event.praise;

  if (praise) {
    return await db.collection('weibo').doc(weiboId).update({
      data: {
        "praises": _.push(openId)
      }
    })
  } else {
    // 1 先获取微博中的点赞数组
    const weiboRes = await db.collection('weibo').doc(weiboId).field({praises: true}).get();
    const praises = weiboRes.data.praises;
    // 2 然后删掉数组中的openID
    const newPraises = [];
    praises.forEach((praise,index)=>{
      if (praise != openId) {
        newPraises.push(praise);
      }
    })
    // 3 把新数据重新设置到数据中
    return await db.collection('weibo').doc(weiboId).update({
      data: {
        "praises": newPraises
      }
    })
  }
}