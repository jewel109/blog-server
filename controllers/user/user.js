const ErrorWrapper = require('express-async-handler')
const {
  validateInput,
  comparePassword,
} = require('../../helpers/inputHelper.js')
const CustomError = require('../../middlewares/Error/CustomError')
const Story = require('../../model/story')
const User = require('../../model/user')
const Message = require("../../model/message.js")
const Notification = require("../../model/notification.js")
const { default: mongoose } = require('mongoose')
const handleError = require('../../helpers/libraries/handleError.js')

const profile = ErrorWrapper(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  })
})

const editProfile = ErrorWrapper(async (req, res) => {
  const { username, email } = req.body
  if (!user) {
    return res.status(202).json({
      success: false,
      message: 'No user found',
    })
  }
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      username,
      email,
    },
    {
      new: true,
      runValidators: true,
    }
  )

  return res.status(200).json({
    success: true,
    data: user,
    message: 'user found',
  })
})
const totalLikedStory = async (req, res, next) => {
  try {
    const { username } = req.body
    if (!username) {
      throw new Error("username is not provided")
    }
    const user = await User.findOne({ username: username }).catch(handleError)
    if (!user) {
      throw new Error("no user found with this username")
    }

    console.log(user)

    //TODO i have to find story which have not null likes properties
    const allStory = await Story.find({
      likes: { $in: [mongoose.Types.ObjectId(user._id)] }
    })
    //TODO how to do this with aggregation

    if (!allStory) {
      throw new Error("allStory is not found")
    }

    console.log(allStory)
    console.log(allStory.length)

    // const aggregationData = await Story.aggregate([
    //   {
    //     $match: {
    //       _id: {
    //         $in:          }
    //     }
    //   }
    // ],)
    //
    // if (!aggregationData) {
    //   throw new Erro("aggregationData is not found")
    // }
    // console.log(aggregationData)
    //

    res.status(200).json({
      stories: allStory,
      total: allStory.length
    })

  } catch (error) {
    console.error(error)
    next(error)

  }
}
const changePassword = ErrorWrapper(async (req, res, next) => {
  const { newPassword, oldPassword } = req.body

  if (!validateInput(newPassword, oldPassword)) {
    return res.status(200).json({
      success: false,
      message: 'Input is wrong',
    })
  }

  const user = User.findById(req.user.id).select('+password')
  if (!user) {
    return res.status(200).json({
      success: false,
      message: 'User is not found',
    })
  } else if (!comparePassword(oldPassword, user.password)) {
    return res.status(200).json({
      success: false,
      message: 'oldpassword is not matched with newPassword',
    })
  }

  user.password = newPassword

  await user.save()

  return res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    data: user,
  })
})

const addStoryToReadList = async (req, res, next) => {
  try {
    let message = ""
    let addedStory = false
    const { slug } = req.body
    const { username } = req.body

    if (!slug) {
      throw new Error("slug is not provided")
    }
    if (!username) {
      throw new Error("username is not provided")
    }
    const story = await Story.findOne({ slug: slug })
    if (!story) {
      throw new Error("story is not found")
    }
    // console.log(story)

    const user = await User.findOne({ username: username })
    if (!user) {
      throw new Error("user is not found")
    }
    console.log(user)
    const findUserHavingIdInReadList = await User.findOne({ _id: mongoose.Types.ObjectId(user._id), readList: { $in: [mongoose.Types.ObjectId(story._id)] } })

    console.log(`if found the user having the story id  ${findUserHavingIdInReadList} `)
    if (findUserHavingIdInReadList) {
      console.log("in here")
      console.log(findUserHavingIdInReadList)
    }
    if (!findUserHavingIdInReadList) {
      const updatedUser = await User.findOneAndUpdate({ username: username }, { $addToSet: { readList: story._id } }, { new: true })
      if (!updatedUser) {
        throw new Error("updatedUser is not found")

      }
      message = "story added to readList"
      addedStory = true
      console.log(updatedUser)

      console.log("if not found the user in the readlist" + updatedUser)

    }

    if (findUserHavingIdInReadList?.readList) {

      const updatedUser = await User.findOneAndUpdate({ username: username }, { $pull: { "readList": mongoose.Types.ObjectId(story._id) } }, { new: true })
      message = "story removed from readList"
      addedStory = false
      console.log("user updated " + updatedUser)
    }

    res.status(200).json({
      message: message, addedStory
    })

  } catch (error) {
    console.error(error)
    next(error)

  }


}

const followerOfUser = async (req, res, next) => {
  try {
    const { username, followingUser } = req.body

    let message = ''

    let userData

    const user = await User.findOne({ username: username }).catch(handleError)
    if (!user) {
      next("no user found with the name")
    }
    console.log(user)

    const followedUser = await User.findOne({ username: followingUser }).catch(handleError)
    if (!followedUser) {
      next("followingUser is not found")
    }
    console.log(followedUser)

    const userAlreadyFollowed = await User.findOne({ username: username, following: { $in: [mongoose.Types.ObjectId(followedUser._id)] } }).catch(handleError)

    console.log("userAlreadyFollowed " + userAlreadyFollowed)

    if (!userAlreadyFollowed) {
      const updatedUser = await User.findOneAndUpdate({ username: username }, {
        $addToSet: {
          following: followedUser._id
        }
        // if u want to update a field you must have the filed in your schema

      }, { new: true }).catch(handleError)

      if (!updatedUser) {
        next("user is not updated")
      }
      console.log("updated user is " + updatedUser)

      message = `you are now following ${followedUser.username}`

      userData = updatedUser

    } else {
      const userAfterRemoveIdFromFollowing = await User.findOneAndUpdate({ username: username }, { $pull: { "following": mongoose.Types.ObjectId(followedUser._id) } }, { new: true }).catch(handleError)

      console.log("userAfterRemoveIdFromFollowing " + userAfterRemoveIdFromFollowing)
      message = `${followedUser.username} is removed from your following list`

      userData = userAfterRemoveIdFromFollowing


    }


    res.status(200).json({
      message: message,
      userData
    })

  } catch (error) {
    console.error(error)
    next(error)
  }
}

const showReadListStatus = async (req, res, next) => {
  const { slug } = req.body
  if (!slug) return next("no slug is found")
  const user = await User.findById(req.user._id).catch(handleError)
  if (!user) next("no user found")

  const thisStory = await Story.findOne({ slug: slug }).catch(handleError)
  // console.log(thisStory)
  if (!user.readList) next("no saved story found")

  const story = await Story.find({
    _id: {
      $in: user?.readList?.map(id => mongoose.Types.ObjectId(id))
    }
  })
  const data = user?.readList?.includes(mongoose.Types.ObjectId(thisStory._id));

  console.log(data)

  // console.log(story)
  res.status(200).json({
    data
  })
}


const showReadList = async (req, res, next) => {
  try {
    const { username } = req.body
    const user = await User.findOne({ username: username }).catch(handleError)
    if (!user) {
      throw new Error("user is not found")
    }
    if (user.readList) {
      const storyData = await Story.find({
        _id: {
          $in: user?.readList?.map(id => mongoose.Types.ObjectId(id))
        }
      }).catch(handleError)
      console.log(storyData)
      res.status(200).json({
        data: storyData
      })
      return
    }
    next("no data found")

  } catch (error) {
    console.error(error)
    next(error)
  }

  // const readList = []
  //
  // for (let index = 0; index < user.readList.length; index++) {
  //   let story = await Story.findById(user.readList[index]).populate('author')
  //
  //   readList.push(story)
  // }
  //
  // return res.status(200).json({
  //   success: true,
  //   data: readList,
  //   message: "Your readlist"
  // })
}

const sendMessageToUser = async (req, res, next) => {
  try {
    const { author, body, sendTo } = req.body
    if (!author || !body || !sendTo) {
      next("no author or body or sendTo found")
    }

    const sendingAuthor = await User.findOne({ username: author }).catch(handleError)
    if (!sendingAuthor) {
      next('author is not found')
    }
    const receivingAuthor = await User.findOne({ username: sendTo }).catch(handleError)
    if (!receivingAuthor) {
      next('receivingAuthor is not found')
    }
    const message = await Message.create({ author: sendingAuthor._id, body: body, sendTo: receivingAuthor._id }).catch(handleError)
    if (!message) {
      next('message is not created')
    }


    console.log(message)
    res.status(200).json({
      message
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getUsers = async (req, res, next) => {

  try {
    const { username } = req.body
    if (!username) {
      return next("username is not provided")
    }
    const page = parseInt(req.query?.page) || 1

    const limit = parseInt(req.query?.limit) || 10
    const skip = (page - 1) * limit

    const users = await User.find({ username: { $ne: username } }, {
      username: 1, _id: 0, email: 1
    }).skip(skip).limit(limit)

    console.log(users)
    res.status(200).json({
      users
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getMessages = async (req, res, next) => {
  try {
    const { author, sendTo } = req.body
    if (!author || !sendTo) {
      return next("no author or sendTo is found")


    }

    const foundAuthor = await User.findOne({ username: author })
    if (!foundAuthor) {

      return next("no user found with named author")
    }
    const foundSendTo = await User.findOne({ username: sendTo }).catch()
    if (!foundSendTo) {
      return next("no sendTo found")
    }

    const page = parseInt(req.query?.page) || 1

    const limit = parseInt(req.query?.limit) || 1000
    const skip = (page - 1) * limit

    const updatedMessages = await Message.updateMany({ author: foundAuthor._id, sendTo: foundSendTo._id }, { senderName: foundAuthor.username, reciverName: foundSendTo.username })

    if (!updatedMessages) {
      next("updatedMessages is not possible")
    }

    const messages = await Message.find({
      $or: [
        {
          author: foundAuthor._id, sendTo: foundSendTo._id
        }, {
          author: foundSendTo._id, sendTo: foundAuthor._id

        }
      ]
    }).skip(skip).limit(limit)
      .sort({ $natural: -1 });

    console.log(messages)

    res.status(200).json({
      messages
    })

  } catch (error) {
    console.error(error)
    next(error)
  }
}

const totalPostedStory = async (req, res, next) => {
  try {

    const { username } = req.body
    console.log(username)
    const story = await Story.find({ author: username }).catch(handleError)
    console.log(story)

    if (story) {
      res.status(200).json({
        story, total: story.length
      })
    } else {
      next("totalPostedStory is not found")
    }


  } catch (error) {
    console.error(error)
    next(error)
  }
}

const makeNotification = async (req, res, next) => {
  try {
    const { message } = req.body

    if (!message) next("no message for notification found")

    const notification = await Notification.create({ message: message, sendingTo: req.user._id }).catch(handleError)
    if (!notification) {
      next("notification is not created")
    }


    const user = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.user._id) }, { $addToSet: { notifications: notification._id } }, { new: true }).catch(handleError)
    if (!user) next("user is not found or updated")

    console.log(notification)
    console.log(user)

  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  profile,
  editProfile,
  makeNotification,
  totalPostedStory,
  changePassword,
  addStoryToReadList,
  totalLikedStory,
  followerOfUser,
  sendMessageToUser,
  showReadList,
  showReadListStatus,
  getUsers,
  getMessages,
}
