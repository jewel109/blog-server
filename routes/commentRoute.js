const express = require("express")
const { getAccessToRoute } = require("../middlewares/auth/accessRoute")
const { commentLike, addNewCommentToStory, getAllCommentByStory, getCommentLikeStatus, addReplyToAComment, getAllRepliesOfAComment, totalLikedComment } = require("../controllers/comment/comment")
const { checkStoryExist } = require("../middlewares/database/databaseErrorHandler")

const router = express.Router()

router.post("/:slug/addcomment", [getAccessToRoute, checkStoryExist], addNewCommentToStory)

router.get("/:slug/getallcomment", getAllCommentByStory)
router.get("/:comment_id/getallreplies", getAllRepliesOfAComment)
router.post("/:comment_id/like", commentLike)

router.post("/:comment_id/getCommentLikeStatus", getCommentLikeStatus)
router.post("/:comment_id/addReplyToAComment", getAccessToRoute, addReplyToAComment)
router.get("/totalLikedComment", totalLikedComment)




module.exports = router
