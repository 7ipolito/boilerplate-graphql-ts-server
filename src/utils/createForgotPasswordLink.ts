import {v4} from "uuid";
import {Redis} from 'ioredis'
import { forgotPasswordPrefix } from "../constants";

export const createConfirmEmailLink = async (
  url:string,
  userId:string,
  redis:Redis
) =>{
  const id = v4();
  await redis.set(`${forgotPasswordPrefix}${id}`, userId, "EX", 60 * 20);
  return `${url}/change-password/${id}`;

}