import { z } from "zod";

export const verifyTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    country: z.string().min(1, "Country is required")
  }),
});

export const generateOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Email is required"),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    otp: z.string().min(6, "OTP is required"),
  }),
});

export const usersSchema = z.object({
  COUNTRY_ID: z.string(),
  ID_PERS: z.number(),
  COMPANY_ID: z.string(),
  EMPLOYEE_ID: z.string(),
  USER_ID: z.string(),
  USER_TYPE: z.string(),
  PASSWORD: z.string(),
  CHANGE_PASSWORD: z.string(),
  MODIFIED_BY: z.string(),
  LAST_MODIFIED_DATE: z.date(),
  SUPERVISOR_ID: z.string(),
  LDAP_ID: z.string(),
  MAIL: z.string(),
  STATUS: z.string(),
  F_RETIRO: z.date(),
});

export const vColaboradoresSchema = z.object({
  COUNTRY_ID: z.string(),
  ID_PERS: z.number(),
  COMPANY_ID: z.string(),
  EMPLOYEE_ID: z.string(),
  DOCUMENT_ID: z.string(),
  NAME1: z.string(),
  LASTNAME1: z.string(),
  MARITAL_STATUS: z.string(),
  GENDER_ID: z.string(),
  BIRTHDATE: z.date(),
  START_DATE: z.date(),
  DEPARTMENT_ID: z.string(),
  DEPARTMENT_NAME: z.string(),
  BRANCH_ID: z.string(),
  BRANCH_NAME: z.string(),
  PAYMENT_TYPE: z.string(),
  POSITION_ID: z.string(),
  POSITION_NAME: z.string(),
  COMPANY_NAME: z.string(),
  NAME2: z.string(),
  LASTNAME2: z.string(),
  MAIL: z.string(),
});

export const getUserSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    country: z.string().min(1, "Country is required")
  })
})

export type VColaboradoresType = z.infer<typeof vColaboradoresSchema>;
export type UsersType = z.infer<typeof usersSchema>;
