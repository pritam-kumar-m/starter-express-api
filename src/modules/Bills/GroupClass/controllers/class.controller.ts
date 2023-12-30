import { Request, Response } from "express";
import commonResponseType from "../../../../../static/static.json";
import { commonResponse } from "../../../../../lib/util";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

interface CustomRequest extends Request {
  userData?: any;
}
const GroupClassCreate = async (req: CustomRequest, res: Response) => {
  try {
    const { name } = req.body;
    const { email } = req.userData;
    const userInfo = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    let userId: string = userInfo.id;
    const saleTaxData = await prisma.groupClass.create({
      data: {
        userId,
        name,
      },
    });
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.TRUE,
      saleTaxData,
      "Class Created successfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
  } catch (error) {
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.FALSE,
      error,
      "Class registered Unsuccessfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res
      .status(commonResponseType.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
      .json(response);
  }
};

export { GroupClassCreate };
