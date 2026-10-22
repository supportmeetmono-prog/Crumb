// The former click/participation/burn-mission campaign has been RETIRED.
// This route is kept as a tombstone so old clients cannot register users.
export default function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.status(410).json({
    retired:true,
    error:'campaign_discontinued',
    message:'CRUMB no longer offers wallet-click registration, token burning or click rewards.'
  });
}
