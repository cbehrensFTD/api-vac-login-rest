import oracledb from "oracledb";

// Global setting for all results to be objects
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export class OracleClient {
  private client: oracledb.Connection | null = null;

  async getClient() {
    if (!process.env.ORACLE_USER) {
      throw new Error("ORACLE_USER not found");
    }

    if (!process.env.ORACLE_PASSWORD) {
      throw new Error("ORACLE_PASSWORD not found");
    }

    if (!process.env.ORACLE_CONNECT_STRING) {
      throw new Error("ORACLE_CONNECT_STRING not found");
    }

    this.client = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
    });

    return this.client;
  }
}
