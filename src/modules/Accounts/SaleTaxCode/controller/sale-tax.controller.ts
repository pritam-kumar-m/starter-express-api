import { Request, Response } from "express";
import commonResponseType from "../../../../../static/static.json";
import { commonResponse } from "../../../../../lib/util";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

interface CustomRequest extends Request {
  userData?: any;
}
const saleTaxCreate = async (req: CustomRequest, res: Response) => {
  try {
    const { name, percentage } = req.body;
    const { email } = req.userData;
    const userInfo = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    let userId: string = userInfo.id;
    const saleTaxData = await prisma.saleTax.create({
      data: {
        userId,
        name,
        percentage,
      },
    });
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.TRUE,
      saleTaxData,
      "Vendor Created successfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
  } catch (error) {
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.FALSE,
      error,
      "Vendor registered Unsuccessfully",
      commonResponseType.RESPONSE_SUCCESS.FALSE
    );
    res
      .status(commonResponseType.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
      .json(response);
  }
};

export { saleTaxCreate };
