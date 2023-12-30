import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import commonResponseType from "../../../../static/static.json";
import { commonResponse } from "../../../../lib/util";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

// Register api
const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      first_name,
      last_name,
      isActive,
      email,
      password,
      confirmPassword,
    } = req.body;
    // Check if email or password is missing
    if (!email || !first_name || !password || !confirmPassword) {
      return res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST)
        .json({
          message: "Some fields are missing",
        });
    }

    // Check if Password and Confirm Password match
    if (password !== confirmPassword) {
      return res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST)
        .json({
          message: "Passwords do not match",
        });
    }

    // find user
    const existingUser = await prisma.user.findMany({
      where: {
        email: email,
      },
    });

    if (existingUser.length > 0) {
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST)
        .json({ message: "User already exists" });
      return;
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const Data = await prisma.user.create({
      data: {
        name,
        first_name,
        last_name,
        email,
        isActive,
        password,
      },
    });
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.TRUE,
      Data,
      "User registered successfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
  } catch (error) {
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.FALSE,
      error,
      "User registered Unsuccessfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res
      .status(commonResponseType.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
      .json(response);
  }
};

// Login api
const login = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST)
        .json({
          message: "Email, Password, and Confirm Password are required.",
        });
    }

    // Fetch user data from the database
    const userData = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (Object.keys(userData).length === 0) {
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR)
        .json({ message: "The provided Email and Password do not match" });
      return;
    }
    if (password !== userData.password) {
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR)
        .json({ message: "The provided Email and Password do not match" });
      return;
    }

    const token = jwt.sign(
      { email: userData.email, name: userData.name, roles: userData.roles },
      `${process.env.AUTH_SECRET_KEY}`,
      {
        expiresIn: "1h", // Token expiration time
      }
    );

    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.TRUE,
      token,
      "User login successfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS)
      .json(response);
  } catch (error) {
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.FALSE,
      error,
      "wrong credential",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res
      .status(commonResponseType.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
      .json(response);
  }
};

// logout api
const logout = async (req: Request, res: Response) => {
  try {
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.TRUE,
      null,
      "User logout successfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res
      .clearCookie("access_token")
      .status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS)
      .json(response);
  } catch (error) {
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.FALSE,
      error,
      "wrong credential",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res
      .status(commonResponseType.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
      .json(response);
  }
};

// forget api
const forgetPass = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const { password, confirmPassword } = body;

    // Check if password is missing
    if (!password || !confirmPassword) {
      return res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST)
        .json({
          message: "Password and Confirm Password are required.",
        });
    }

    // Check if Password and Confirm Password match
    if (password !== confirmPassword) {
      return res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST)
        .json({
          message: "Passwords do not match",
        });
    }

    const token = req.header("Authorization")?.replace("Bearer ", "");
    let verifyToken = jwt.verify(
      token,
      process.env.AUTH_SECRET_KEY
    ) as JwtPayload;

    let email = verifyToken.email;

    const updateUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: password,
      },
    });
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.TRUE,
      null,
      "User login successfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res
      .clearCookie(token)
      .status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS)
      .json(response);
  } catch (error) {
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.FALSE,
      error,
      "wrong credential",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res
      .status(commonResponseType.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
      .json(response);
  }
};
export { register, login, logout, forgetPass };
