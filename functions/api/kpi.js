export async function onRequestPost({request,env}) {
  try {
    if(!env.GAS_URL||!env.KPI_BRIDGE_SECRET) return Response.json({ok:false,error:'กรุณาตั้งค่า GAS_URL และ KPI_BRIDGE_SECRET ใน Cloudflare Pages'},{status:503});
    const body=await request.json();
    const allowed=new Set(['authBegin','authFinish','authPing','authLogout','readAll','saveDay','getBetRankData','getBetSheetInfo','getNewMemberReport']);
    if(!allowed.has(body.method)||!Array.isArray(body.args))return Response.json({ok:false,error:'Invalid method or args'},{status:400});
    const target=String(env.GAS_URL).trim();
    if(!/^https:\/\/script\.google\.com\/.*\/exec(?:\?.*)?$/.test(target))return Response.json({ok:false,error:'GAS_URL ต้องเป็น URL /exec ของ Google Apps Script deployment'},{status:502});
    const upstream=await fetch(target,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({method:body.method,args:body.args,secret:env.KPI_BRIDGE_SECRET}),redirect:'follow'});
    const raw=await upstream.text();
    let data;
    try{data=JSON.parse(raw)}catch(e){
      console.error('GAS non-JSON response',JSON.stringify({status:upstream.status,contentType:upstream.headers.get('content-type'),urlHost:new URL(upstream.url).hostname,html:raw.trimStart().startsWith('<')}));
      return Response.json({ok:false,error:'Apps Script ไม่ส่ง JSON (HTTP '+upstream.status+'). ตรวจสอบ /exec, สิทธิ์เว็บแอป และ doPost เวอร์ชันล่าสุด'},{status:502});
    }
    return Response.json(data,{status:data.ok===false?400:upstream.ok?200:502,headers:{'Cache-Control':'no-store'}});
  }catch(e){console.error('KPI proxy error',String(e));return Response.json({ok:false,error:'Cloudflare ติดต่อ Apps Script ไม่สำเร็จ: '+String(e.message||e)},{status:502});}
}
