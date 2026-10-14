export async function onRequestPost({request,env}) {
  try {
    if (!env.GAS_URL || !env.KPI_BRIDGE_SECRET) return Response.json({ok:false,error:'กรุณาตั้งค่า GAS_URL และ KPI_BRIDGE_SECRET ใน Cloudflare Pages'}, {status:503});
    const body=await request.json();
    const allowed=['authBegin','authFinish','authPing','authLogout','readAll','saveDay','getBetRankData','getBetSheetInfo','getNewMemberReport'];
    if(!allowed.includes(body.method)||!Array.isArray(body.args))return Response.json({ok:false,error:'Invalid request'}, {status:400});
    const upstream=await fetch(env.GAS_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({method:body.method,args:body.args,secret:env.KPI_BRIDGE_SECRET}),redirect:'follow'});
    const responseText=await upstream.text();
    let result;try{result=JSON.parse(responseText)}catch{throw Error('Apps Script ไม่ส่ง JSON: ตรวจสอบ Web App deployment และสิทธิ์เข้าถึง')}
    return Response.json(result,{status:result.ok?200:400,headers:{'Cache-Control':'no-store'}});
  }catch(e){return Response.json({ok:false,error:String(e.message||e)}, {status:502});}
}
