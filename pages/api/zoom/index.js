import nc from "next-connect"
import { v4 as uuidv4 } from 'uuid';
import { encrypt } from "../../../common";

const handler = nc()

handler.post( async (req, res) => {
  const { name, password } = req.body
  const encodedData = encrypt(`${name}::${password}`)
  res.json({
    z: encodedData.iv,
    n: encodedData.content
  })
})

export default handler
