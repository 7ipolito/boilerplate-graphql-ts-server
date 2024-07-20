import { gql, request } from 'graphql-request'
import { startServer } from "..";
import { host } from "./constants";
import { register } from "module";
const email = "bob@bob.com";

const password = "12345";

const mutation = `
  mutation{
  register(email: "${email}", password: "${password}")
}
`

test("Register user", async () => { 
  await startServer();
  const response = await request(host, mutation);
  expect(response).toEqual({register:true})
});