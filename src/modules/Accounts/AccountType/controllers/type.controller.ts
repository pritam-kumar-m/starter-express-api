import { Request, Response } from "express";
import commonResponseType from "../../../../../static/static.json";
import { commonResponse } from "../../../../../lib/util";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

interface CustomRequest extends Request {
  userData?: any;
}
const accountTypeCreate = async (req: CustomRequest, res: Response) => {
  try {
    const { name } = req.body;
    console.log('name: ', name);
    const { email } = req.userData;
    const accountTypeData = await prisma.accountType.create({
      data: {
        name,
      },
    });
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.TRUE,
      accountTypeData,
      "Account Created successfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
  } catch (error) {
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.FALSE,
      error,
      "Account registered Unsuccessfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res
      .status(commonResponseType.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
      .json(response);
  }
};

export { accountTypeCreate };
