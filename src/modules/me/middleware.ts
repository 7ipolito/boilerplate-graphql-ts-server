export default async (resolver:any, parents:any, args:any, context:any, info:any)=>{
  //middleware
  const result = await resolver(parent,args, context, info);

  //afterware

  return result
}