"use server";

import { redirect } from "next/navigation";
import { createRun } from "./db";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export const submitRun = async (data: FormData) => {
  const name = data.get("name")?.toString();
  const company = data.get("company")?.toString();
  const mileage = data.get("mileage")?.toString();
  const blob = data.get("blob")?.toString();

  if (!name || !company || !mileage || !blob) {
    return { success: false, message: "Something went wrong" };
  }

  const _company = await prisma.company.findFirst({ where: { name: company } });

  if (!_company) {
    return { success: false, message: "Something went wrong" };
  }

  await createRun(name, parseInt(mileage), _company.id, blob, (run) => {
    console.log(
      `A new run was clocked by ${run.user}, for ${run.mileage}km(s)`
    );
    revalidatePath("/");
    redirect("/");
  });

  return { success: true, message: "" };
};
