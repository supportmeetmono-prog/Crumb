// Legacy tap counter retired. No click registrations are accepted.
export default function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.status(410).json({retired:true,error:'counter_discontinued'});
}
