import { Handler } from "express";
import { authService } from "../services/auth.service";
import { emailService } from "../services/email.service";

export const verifyToken: Handler = async (req, res) => {
  try {
    const { token } = req.body;

    const verifyTokenResult = await authService.verifyToken(token);

    if (!verifyTokenResult.success) {
      return res.status(401).json({
        code: verifyTokenResult.code,
        message: verifyTokenResult.message,
      });
    }

    if (!verifyTokenResult.email) {
      throw new Error("Email not found");
    }

    const validateEmailResult = await authService.validateEmail(
      verifyTokenResult.email
    );

    if (!validateEmailResult.success) {
      return res.status(401).json({
        code: validateEmailResult.code,
        message: validateEmailResult.message,
      });
    }

    return res.status(200).json({
      message: "Token verified successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const generateOtp: Handler = async (req, res) => {
  try {
    const { email } = req.body;

    const { otp, token } = await authService.generateOtp(email);

    await emailService.sendMail(
      email,
      "Verificación de OTP",
      `Tu codigo OTP es: ${otp}`
    );

    return res.status(200).json({
      message: "OTP generated successfully",
      token,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const verifyOtp: Handler = async (req, res) => {
  try {
    const { token, otp } = req.body;

    const verifyOtpResult = await authService.verifyOtp(token, otp);

    if (!verifyOtpResult.success) {
      return res.status(401).json({
        code: verifyOtpResult.code,
        message: verifyOtpResult.message,
      });
    }

    if (!verifyOtpResult.email) {
      throw new Error("Email not found");
    }

    const validateEmailResult = await authService.validateEmail(
      verifyOtpResult.email
    );

    if (!validateEmailResult.success) {
      return res.status(401).json({
        code: validateEmailResult.code,
        message: validateEmailResult.message,
      });
    }

    res.status(200).json({
      message: "Verify otp successfully",
      user: validateEmailResult.user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
