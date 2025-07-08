import jwt from "jsonwebtoken";
import { FirebaseClient } from "../config/firebase";
import { OracleClient } from "../config/oracle";
import { UsersType, VColaboradoresType } from "../schemas/auth.schema";

export class AuthService {
  private firebaseClient: FirebaseClient;
  private oracleClient: OracleClient;

  constructor() {
    this.oracleClient = new OracleClient();
    this.firebaseClient = new FirebaseClient();
  }

  async verifyToken(token: string) {
    try {
      const auth = this.firebaseClient.getAuth();
      const decodedToken = await auth.verifyIdToken(token);

      return {
        success: true,
        email: decodedToken.email,
      };
    } catch (error: any) {
      let code = "";
      let message = "";

      if (error.code === "auth/id-token-expired") {
        code = "1001";
        message = "Token expired";
      }

      if (error.code === "auth/invalid-id-token") {
        code = "1002";
        message = "Invalid token";
      }

      if (error.code === "auth/id-token-revoked") {
        code = "1003";
        message = "Token revoked";
      }

      return {
        code,
        success: false,
        message: message || error.message,
      };
    }
  }

  async validateEmail(email: string) {
    const client = await this.oracleClient.getClient();

    const colaboratorsResult = await client.execute<{
      rows: VColaboradoresType[];
    }>(`SELECT * FROM VMP.V_COLABORADORES WHERE MAIL = :email`, { email });

    if (!colaboratorsResult?.rows?.length) {
      return {
        success: false,
        code: "1004",
        message: "Colaborator not found",
      };
    }

    const colaborator = colaboratorsResult
      .rows[0] as unknown as VColaboradoresType;

    const usersResult = await client.execute<{ rows: UsersType[] }>(
      `SELECT * FROM VMP.USERS WHERE ID_PERS = :idPers`,
      { idPers: colaborator.ID_PERS }
    );

    if (!usersResult?.rows?.length) {
      return {
        success: false,
        code: "1005",
        message: "User not found",
      };
    }

    const user = usersResult.rows[0] as unknown as UsersType;

    if (user.STATUS === "I") {
      return {
        success: false,
        code: "1006",
        message: "User is inactive",
      };
    }

    return {
      success: true,
      user
    };
  }

  async generateOtp(email: string) {
    if (!process.env.OTP_SECRET) {
      throw new Error("OTP_SECRET not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const payload = {
      email,
      otp,
    };

    const token = jwt.sign(payload, process.env.OTP_SECRET, {
      expiresIn: "1m",
    });

    return { otp, token };
  }

  async verifyOtp(token: string, otp: string) {
    try {
      if (!process.env.OTP_SECRET) {
        throw new Error("OTP_SECRET not found");
      }

      const decodedToken = jwt.verify(token, process.env.OTP_SECRET) as {
        otp: number;
        email: string;
      };

      const decodedOTP = decodedToken.otp;
      const decodedEmail = decodedToken.email;

      if (decodedOTP !== parseInt(otp)) {
        return {
          success: false,
          code: "1008",
          message: "Invalid OTP",
        }
      }

      return {
        success: true,
        email: decodedEmail,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return {
          success: false,
          code: "1007",
          message: "JWT invalid or expired",
        };
      }

      throw error;
    }
  }
}

export const authService = new AuthService();
