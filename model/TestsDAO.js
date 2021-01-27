let tests

export default class TestsDAO {
  static async injectDB(conn) {
    if (tests) {
      return
    }

    try {
      tests = await conn.db(process.env.TYPING_DB).collection("tests")
    } catch (e) {
      console.log(`Unable to establish collection handles in Tests Model: ${e}`)
    }
  }

  static async addTest(email, correctWords, wrongWords, score) {
    try {
      await tests.updateOne(
        {
          email,
        },
        {
          $push: {
            correctWords,
            wrongWords,
            score,
          },
        },
        {
          upsert: true,
        }
      )
      return { success: true }
    } catch (e) {
      return { error: e }
    }
  }

  static async getMetaData(email) {
    try {
      const metaData = await tests
        .aggregate([
          {
            $match: {
              email,
            },
          },
          {
            $project: {
              wrongWords: 1,
              _id: 0,
              numOfTests: {
                $size: "$score",
              },
              averageScore: {
                $avg: "$score",
              },
            },
          },
        ])
        .toArray()

      return { metaData: metaData[0] }
    } catch (e) {
      return { error: e }
    }
  }
}
