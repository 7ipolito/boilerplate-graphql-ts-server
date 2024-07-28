import {v4} from "uuid";
import {Redis} from 'ioredis'

export const createConfirmEmailLink = (url:string, userId:string, redis:Redis) =>{
  const id = v4();
  redis.set(id, userId, "ex", 60*60*24);

}