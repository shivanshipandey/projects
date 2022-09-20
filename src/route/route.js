const mongoose= require('mongoose')
const router = express.Router()



const userController = require("../controllers/userController")

router.post("/register", userController.creatuser)


module.exports = router;