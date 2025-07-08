import admin from "firebase-admin";

export class FirebaseClient {
  private client: admin.app.App;

  constructor() {
    if (!process.env.SERVICE_ACCOUNT) {
      throw new Error(
        "The SERVICE_ACCOUNT environment variable was not found."
      );
    }

    this.client = admin.initializeApp({
      credential: admin.credential.cert(process.env.SERVICE_ACCOUNT),
    });
  }

  getAuth() {
    return this.client.auth();
  }
}
