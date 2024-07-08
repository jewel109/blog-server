const express = require("express")

const router = express.Router()

const { getAccessToRoute } = require("../middlewares/auth/accessRoute")


const { addStory, editStory, deleteStory, editStoryPage, likeStory, detailStory, getAllStories, searchInStory, storyLikeStatus, commentStatusOfAStory, search } = require("../controllers/story/story")

const { checkStoryExist, checkUserAndStoryExist } = require("../middlewares/database/databaseErrorHandler")
const { addStoryToReadList, followerOfUser } = require("../controllers/user/user")


router.post("/addstory", [getAccessToRoute, addStory])
router.post("/addStoryToReadList", addStoryToReadList)

router.post("/:slug", getAccessToRoute, detailStory)
router.get("/:slug/likeStatus", getAccessToRoute, storyLikeStatus)

router.post("/:slug/like", getAccessToRoute, likeStory)
router.post("/:slug/commentStatus", commentStatusOfAStory)

router.post("/editstory/:slug", editStoryPage)

router.put("/:slug/edit", [getAccessToRoute, checkStoryExist, checkUserAndStoryExist], editStory)

router.delete("/:slug/delete", [getAccessToRoute, checkStoryExist], deleteStory)

router.get("/getallstories", getAllStories)
router.post("/search", search)
router.post("/follow", followerOfUser)

module.exports = router
