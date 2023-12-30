import { Request, Response } from "express";
import commonResponseType from "../../../../../static/static.json";
import { commonResponse } from "../../../../../lib/util";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

interface CustomRequest extends Request {
  userData?: any;
}
const vendorCreate = async (req: CustomRequest, res: Response) => {
  try {
    const {
      name,
      address,
      city,
      state,
      postal_code,
      account_number,
      t4a_eligible,
      account_name,
    } = req.body;
    const { email } = req.userData;
    const userInfo = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    let userId: string = userInfo.id;
    const vendorData = await prisma.vendor.create({
      data: {
        userId,
        name,
        address,
        city,
        state,
        postal_code,
        account_number,
        t4a_eligible,
        account_name,
      },
    });
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.TRUE,
      vendorData,
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

// Vendor get
const vendorGet = async (req: Request, res: Response) => {
  try {
    let getVendorData = await prisma.vendor.findMany({});
    let response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.TRUE,
      getVendorData,
      "Vendor get successfully",
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

export { vendorCreate, vendorGet };
