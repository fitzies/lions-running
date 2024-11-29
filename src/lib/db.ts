"use server";

import { Run } from "@prisma/client";
import prisma from "./prisma";

export const getCompanies = async () => {
  return await prisma.company.findMany({ include: { runs: true } });
};

export const createRun = async (
  name: string,
  mileage: number,
  companyId: number,
  blob: string,
  callback?: (run: Run) => any
) => {
  const run = await prisma.run.create({
    data: {
      user: name,
      mileage,
      companyId,
      blob,
    },
  });

  if (callback && run.user) {
    callback(run);
  }
};
