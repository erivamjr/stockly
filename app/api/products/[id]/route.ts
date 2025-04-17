import { NextRequest } from "next/server";
import { db } from "../../../_lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("teste");
  console.log("Query: ", query);
  const { id } = params;
  const product = await db.product.findUnique({
    where: { id: id as string },
  });
  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
  return Response.json(product, { status: 200 });
}
