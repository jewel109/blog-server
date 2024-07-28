const express = require("express")
const ErrorWrapper = require("express-async-handler")
const Story = require("../../model/story")
const { searchHelper, paginateHelper } = require("../../helpers/queryhelpers.js")
const chalk = require("chalk")
const { objectId, default: mongoose } = require("mongoose")
const { handleError } = require("../../helpers/libraries/handleError")
const User = require("../../model/user")
const Comment = require("../../model/comment")
const { sendStatusError } = require("../../helpers/httpError")

const amqplib = require("amqplib")

let channel;



const addStory = async (req, res, next) => {

  const { title, content } = req.body

  if (!title || !content) return sendStatusError(res, 404, "no title or content provided")

  if (content.length < 10) return sendStatusError(res, 404, "content is less then 10 character")

  let wordCount = content.trim().split(/\s+/).length

  // The trim() method removes whitespace from both sides of a string.
  // The split() method splits a string into an array of substrings.
  //
  // The split() method returns the new array.
  //
  // The split() method does not change the original string.

  let readTime = Math.floor(wordCount / 200)
  try {
    const newStory = await Story.create({
      title,
      content,
      author: req.user._id,
      author: req.user.username,
      readTime
    })
    if (newStory) {
      // amqplib.connect('amqp://localhost', (err, connection) => {
      //   if (err) {
      //     console.error('Error connecting to RabbitMQ:', err);
      //     return;
      //   }
      //   console.log("in rabbitmq")
      //
      //   connection.createChannel((err, ch) => {
      //     if (err) {
      //       console.error('Error creating channel:', err);
      //       return;
      //     }
      //
      //     channel = ch;
      //
      //
      //
      //   });
      //
      // });
      //
      try {
        const connect = await amqplib.connect("amqp://localhost")

        channel = await connect.createChannel()
        channel.assertQueue("CREATE_POST", 'direct', { durable: false });
        channel.sendToQueue("CREATE_POST", Buffer.from(JSON.stringify(newStory)))
        // console.log("i am called")



      } catch (error) {

        console.log(error)
      }
    }
    // const data = await channel.consume('FOUND_POST')

    // const data1 = JSON.parse(data)
    // console.log(data)


    return res.status(200).json({
      success: true,
      message: "Story added successfully",
      data: newStory
    })
  } catch (err) {
    return next(err)
  }


}

const getAllStories = ErrorWrapper(async (req, res, next) => {
  try {
    const page = parseInt(req.query?.page) || 1

    const limit = parseInt(req.query?.limit) || 10
    const skip = (page - 1) * limit
    const query = await Story.aggregate([{ $match: {} }]).sort({ createdAt: -1 }).skip(skip).limit(limit)   // query.sort("createdAt")
    // query.limit(3)
    console.log(query)
    return res.status(200).json({
      query
    })

  } catch (error) {
    return next(error)
  }
})

const commentStatusOfAStory = async (req, res, next) => {
  try {

    const { slug } = req.params
    if (!slug) next("no slug is provided")
    const story = await Story.findOne({ slug }).catch(handleError)
    console.log(story)

    const comment = await Comment.find({
      _id: {
        $in: story?.comments?.map(id => mongoose.Types.ObjectId(id))
      }
    }).catch(handleError)

    console.log(comment)

  } catch (error) {
    console.error(error)
    next(error)
  }
}

const detailStory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) return sendStatusError(res, 404, "no slug  is provided")
    const story = await Story.findOne({
      slug
    }).catch(handleError)

    // const user = await User.findOne({ username: activeUser }).catch(handleError)


    console.log(story)
    return res.status(200).json({
      story
    })
  } catch (error) {
    console.error(error)
    sendStatusError(res, 500, error)
  }

}

const storyLikeStatus = async (req, res, next) => {
  try {
    let likeStatus = false
    let message = null
    const { slug } = req.params
    if (!slug) next("no slug is found")
    const user = req.user

    const story = await Story.findOne({ slug, likes: { $in: mongoose.Types.ObjectId(user._id) } }).catch(handleError)

    console.log(story)
    if (story) {
      likeStatus = true
      message = "story found"
    }

    console.log(likeStatus)

    res.status(200).json({
      likeStatus, message
    })

  } catch (error) {
    console.log(error)
    next(error)
  }
}

const likeStory = async (req, res, next) => {
  const user = req.user;
  const { slug } = req.params;

  const story = await Story.findOneAndUpdate({
    slug
  }, [
    {
      $set: {
        "likes": {
          $cond: [
            {
              $in: [user._id, "$likes"]
            },
            {
              $setDifference: ["$likes", [user._id]]
            },
            {
              $concatArrays: ["$likes", [user._id]]
            }
          ]
        },
      },

    },
    {
      $set: {
        "likeCount":
        {
          $cond:
            { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: 0 }
        }

      }

    }


  ],).catch(handleError)

  if (!story) {
    next("story is not found")
  }

  console.log(story)
  const findStory = await Story.aggregate([
    {
      $match: {
        slug: slug
      },

    }, {
      $set: {
        "isLiked": {
          $cond: [
            { $in: [user._id, "$likes"] }, true, false
          ]
        }
      }
    },
    {
      $set: {
        "likeStatus": {
          $cond: [
            { $in: [user._id, "$likes"] }, "liked", "unliked"
          ]
        }
      }
    }

  ]).catch(handleError)

  // console.log(findStory[0].likeStatus)



  return res.status(200).json({
    message: `you have ${findStory[0].likeStatus} the story`,
    isLiked: findStory[0].isLiked
  })


}


const editStoryPage = async (req, res, next) => {
  try {
    const { slug } = req.params
    const { title, content } = req.body

    if (!title || !content) {
      next("no title or content")
    }

    const story = await Story.findOneAndUpdate({
      slug
    }, { title: title, content: content }, { new: true }).catch(handleError)

    console.log("story is " + story)

    return res.status(200).json({
      success: true,
      data: story
    })



  } catch (error) {
    console.error(error)
    next(error)
  }
}

const search = async (req, res, next) => {
  try {
    const { searchString, filter } = req.body
    if (!searchString) {
      return next("you should give a searchString")
    }

    let searchResult = null

    if (!filter || filter == "post") {
      searchResult = await Story.find({
        $or: [

          {
            $text: {
              $search: searchString
            }
          },
          {
            // "content": { $regex: `^${searchString}`, $options: 'i' }
            content: { $regex: searchString }
          },
        ]
      })
    } else if (filter == "user") {
      searchResult = await User.find({
        $or: [

          {
            $text: {
              $search: searchString
            }
          },
          {
            // "content": { $regex: `^${searchString}`, $options: 'i' }
            username: { $regex: searchString }
          },
        ]
      })
    } else if (filter == "comment") {
      searchResult = await Comment.find({
        $or: [

          {
            $text: {
              $search: searchString
            }
          },
          {
            // "content": { $regex: `^${searchString}`, $options: 'i' }
            content: { $regex: searchString }
          },
        ]
      })

    } else {
      searchResult = " Nothing found"

    }



    console.log(searchResult)

    res.status(200).json({
      searchResult
    })


  } catch (error) {
    console.error(error)
    next(error)
  }
}

const editStory = ErrorWrapper(async (req, res, next) => {
  const { slug } = req.params
  const { title, content } = req.body

  const story = await Story.findOne({
    slug
  })

  story.title = title
  story.content = content

  await story.save()

  return res.status(200).json({
    success: true,
    data: story
  })

})


const deleteStory = ErrorWrapper(async (req, res, next) => {
  const { slug } = req.params
  console.log(slug)

  const story = await Story.findOne({ slug })

  console.log(story)

  await story.remove()

  return res.status(200).json({
    success: true,
    message: "Story is deleted successfully"
  })
})


module.exports = {
  addStory,
  getAllStories,
  detailStory,
  likeStory,
  editStoryPage,
  editStory,
  search,
  storyLikeStatus,
  commentStatusOfAStory,
  deleteStory
}
