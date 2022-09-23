import nc from "next-connect"
import { decrypt } from "../../../common"

const handler = nc()

handler
  .get(async (req, res) => {
    const { id } = req.query
    const [content, iv] = id.split("-")
    try {
      const decoded = decrypt({ iv , content})
      const [zoomName, password] = decoded.split("::")
      console.log(12, zoomName, password)
      res.json({
        zoomName,
        needPass: password.length > 0
      })
    } catch (error) {
      console.log(error)
      res.status(401).json({
        message: "Unauthention"
      })
    }
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
