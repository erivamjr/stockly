import { db } from "../../_lib/prisma";

// This only refers to the study guide, not to the code project.
export async function GET() {
  const products = await db.product.findMany({});
  return Response.json(products, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = body.name;
  const price = body.price;
  const stock = body.stock;
  await db.product.create({
    data: {
      name,
      price,
      stock,
    },
  });
  return Response.json(
    { message: "Product created with success!" },
    { status: 201 },
  );
}
