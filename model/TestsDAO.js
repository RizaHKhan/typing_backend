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

  static async addTest(email, wrongWords, score) {
    try {
      await tests.updateOne(
        {
          email,
        },
        {
          $push: {
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
              _id: 0,
              wrongWords: 1,
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

      const globalAvg = await tests
        .aggregate([
          {
            $project: {
              _id: 0,
              score: 1,
            },
          },
          {
            $unwind: "$score",
          },
          {
            $group: {
              _id: null,
              average: {
                $avg: "$score",
              },
            },
          },
          {
            $project: {
              _id: 0,
              average: 1,
            },
          },
        ])
        .toArray()

      return { metaData: metaData[0], globalAvg: globalAvg[0] }
    } catch (e) {
      return { error: e }
    }
  }
}
