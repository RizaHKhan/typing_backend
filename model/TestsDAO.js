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
}
