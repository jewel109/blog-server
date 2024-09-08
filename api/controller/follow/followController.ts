import { userService } from "../../../core/app/repository/userRepository";
import { IUser } from "../../../core/doamin/model/userModel";
import { AuthenticatedRequest } from "../../../utils/authUtils";
import { sendResponse, withRequest } from "../../../utils/controllerUtils";
import { SERVER_ERR_MSG, SUCCESS_RES_MSG } from "../../../utils/responseDataUtils";
import { AuthenticatedUserT } from "../auth/authController";




export const followingController = withRequest<AuthenticatedUserT>(async (req, res) => {

  try {
    const user = req.userData
    console.log("user ", user)
    if (!user) return sendResponse(res, { msg: "User is not found" })
    const { followeeEmail } = req.body
    // console.log(followeeEmail)
    if (!followeeEmail) return sendResponse(res, { msg: "followeeEmail is not provided" })

    const { data: followeeData } = await userService.findbyEmail(followeeEmail)

    if (!followeeData) return sendResponse(res, { msg: "no user is registered with followeeEmail" })

    console.log("followeeData ", followeeData)

    const { data: isfollowed, msg: isFollowedMsg, status: followStatus, statusCode: followStatusCode } = await userService.isUserFollowed(user, followeeData)

    console.log("isfollowed ? ", isfollowed)

    console.log("isFollowedMsg ", isFollowedMsg)
    if (isfollowed) {
      return sendResponse(res, { msg: isFollowedMsg, status: followStatus, statusCode: followStatusCode, data: isfollowed })
    }

    const { msg, data, statusCode, status } = await userService.addToFollowingField(user, followeeData)

    return sendResponse(res, { msg, status, statusCode, data })
    // console.log(userData)
  } catch (error) {
    const e = error as Error
    sendResponse(res, { msg: e.message, data: SERVER_ERR_MSG, statusCode: 500 })
  }


})




//
// try {
//   const { followingUser } = req.body
//
//   const username = req.user.username
//   let message = ''
//
//
//   let userData
//
//   const user = await User.findOne({ username: username }).catch(handleError)
//   if (!user) {
//     return sendStatusError(res, 404, "no user found with the name")
//   }
//   console.log(user)
//
//   const users = await User.find({})
//   console.log("users ", users)
//   const followedUser = await User.findOne({ username: followingUser }).catch(handleError)
//   if (!followedUser) {
//     return sendStatusError(res, 404, "followingUser is not found")
//   }
//   console.log(followedUser)
//
//   const userAlreadyFollowed = await User.findOne({ username: username, following: { $in: [mongoose.Types.ObjectId(followedUser._id)] } }).catch(handleError)
//
//   console.log("userAlreadyFollowed " + userAlreadyFollowed)
//
//   if (!userAlreadyFollowed) {
//     const updatedUser = await User.findOneAndUpdate({ username: username }, {
//       $addToSet: {
//         following: followedUser._id
//       }
//       // if u want to update a field you must have the filed in your schema
//
//     }, { new: true }).catch(handleError)
//
//     if (!updatedUser) {
//       return sendStatusError(res, 404, "user is not updated")
//     }
//     console.log("updated user is " + updatedUser)
//
//     message = `you are now following ${followedUser.username}`
//
//     userData = updatedUser
//
//   } else {
//     const userAfterRemoveIdFromFollowing = await User.findOneAndUpdate({ username: username }, { $pull: { "following": mongoose.Types.ObjectId(followedUser._id) } }, { new: true }).catch(handleError)
//
//     console.log("userAfterRemoveIdFromFollowing " + userAfterRemoveIdFromFollowing)
//     message = `${followedUser.username} is removed from your following list`
//
//     userData = userAfterRemoveIdFromFollowing
//
//
//   }
