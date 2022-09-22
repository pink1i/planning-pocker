import nc from "next-connect"
import { decrypt } from "../../../common"

const handler = nc()

handler
  .get(async (req, res) => {
    const { id } = req.query
    const [iv, content] = id.split("-")
    const decoded = decrypt({ iv , content})
    const [zoomName, password] = decoded.split("::")

    res.json({
      zoomName,
      needPass: password.length > 0
    })
  })
  .post(async (req, res) => {
    const { id } = req.query
    const { password } = req.body
    const [iv, content] = id.split("-")
    const decoded = decrypt({ iv , content})
    const [_, pass] = decoded.split("::")

    res.json({
      isAuthen: password == pass
    })
  })

export default handler
