import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { commonResponse } from "../../lib/util";
import commonResponseType from "../../static/static.json";
interface CustomRequest extends Request {
  userData?: any;
}

export const auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }
    const token_cookies = req.cookies.access_token;

    if (!token_cookies) {
      return res.status(400).json({ message: "token are expire" });
    }
    const userData = jwt.verify(token, process.env.AUTH_SECRET_KEY);
    req.userData = userData;
    next();
  } catch (error) {
    console.log("error: ", error);
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.FALSE,
      error,
      "Please authenticate",
      commonResponseType.RESPONSE_SUCCESS.TRUE
    );
    res
      .status(commonResponseType.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
      .json(response);
  }
};
