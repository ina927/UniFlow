// import { NextRequest, NextResponse } from "next/server";
// import { getUsers, createUser } from "@/entities";

// // GET /api/user  – collection route (no 2nd arg!)
// export async function GET(_req: NextRequest) {
//   try {
//     const users = await getUsers();
//     return NextResponse.json(users, { status: 200 });
//   } catch (e) {
//     console.error("Error fetching users:", e);
//     return NextResponse.json("Internal Server Error", { status: 500 });
//   }
// }

// // POST /api/user – create user
// export async function POST(req: NextRequest) {

//   const body = await req.json();

//   try {
//     const user = await createUser({
//       ...body,
//       hash: body?.password,
//       dob: body?.dob ? new Date(body.dob) : undefined,
//     });
//     return NextResponse.json(user, { status: 201 });
//   } catch (e) {
//     console.error("Error creating user:", e);
//     return NextResponse.json("Internal Server Error", { status: 500 });
//   }
// }