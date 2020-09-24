// 检查文字内容是否安全
const cloud = require('wx-server-sdk')
//图片鉴黄sdk
const { ImageClient } = require("image-node-sdk")

cloud.init()
//db 的获取必须放在 cloud.init()下面
const db = cloud.database();

const got = require("got")

const APPID = "wxbcd2cdea603c858b";
const APPSECURATE = "6bec687f57c276f5c14c8bcdedca2fe4";

//获取token url
const TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+APPID+"&secret="+APPSECURATE;
//获取checkURL
const CHECK_URL = "https://api.weixin.qq.com/wxa/msg_sec_check?access_token=";

//图片鉴黄
let AppId = '1303251682'; // 腾讯云 AppId
let SecretId = 'AKIDzqcBZdAgmcm5JL5vviHZYy833pBb2xSj'; // 腾讯云 SecretId
let SecretKey = 'BlFSRARVKQdKySjKkwvGk2JTZWEoVzDE'; // 腾讯云 SecretKey
function getImageUrl(fileID){
  const baseUrl = "https://7465-test-cv537-1301968032.tcb.qcloud.la";
  const baseFileID = "cloud://test-cv537.7465-test-cv537-1301968032";
  const path = fileID.replace(baseFileID,"");
  const imageUrl = baseUrl + path;
  return imageUrl;
}

// 云函数入口函数
exports.main = async (event, context) => {
  const content = event.content;
  const author = event.author;
  const location = event.location;
  const images = event.images; //fileId
  
  const imagesUrls = [];
  images.forEach((value,index)=>{
    const imageUrl = getImageUrl(value);
    imagesUrls.push(imageUrl);
  })

  //图片涉黄检查
  let imgClient = new ImageClient({ AppId, SecretId, SecretKey }); 
  const imgResp = await imgClient.imgPornDetect({
    data: {
      url_list: imagesUrls
    }
  })
  const imgCheckResult = JSON.parse(imgResp.body);
  imgCheckResult.result_list.forEach((value,index) => {
    const result = value.data.result;
    if(result != 0){
      return {"errcode": 2,"errmsg": "您的微博有风险，请修改再发布"};
    }
  })
  
  //内容安全检查
  const tokenResp = await got(TOKEN_URL);
  const tokenBody = JSON.parse(tokenResp.body);
  const token = tokenBody.access_token;
  const checkResp = await got(CHECK_URL+token,{
    method: 'POST',
    body: JSON.stringify({
      content: content
    })
  });
  const checkBody = JSON.parse(checkResp.body);
  const errcode = checkBody.errcode;
  if (errcode == 0) {
    return await db.collection("weibo").add({
        "data": {
          content:content,
          author:author,
          location: location,
          images:images
        }
    })
  } else {
    return {"errcode": 1,"errmsg": "您的微博有风险，请修改再发布"};
  }
}