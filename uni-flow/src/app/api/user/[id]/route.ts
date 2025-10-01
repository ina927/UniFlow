// import { NextRequest } from "next/server";
// // import { ApiParams } from "@/shared/api/models";
// // import { withDB } from "@/shared/api/middlewares/with-db";
// // import { deleteUser, getUserById, updateUser } from "@/entities/users/services";

// export const GET = withDB(async (req: NextRequest, params?: ApiParams) => {
//   if (!params) {
//     return {
//       status: 400,
//       data: "Missing parameters",
//     };
//   }

//   const { id } = await params.params;

//   try {
//     const user = await getUserById(id);

//     if (!user) {
//       return {
//         status: 404,
//         data: "User not found",
//       };
//     }
    
//     return {
//       status: 200,
//       data: user,
//     };
//   } catch (error) {
//     console.error("Error fetching user by ID:", error);
//     return {
//       status: 500,
//       data: "Internal Server Error",
//     };
//   }
// });

// export const PATCH = withDB(async (req: NextRequest, params?: ApiParams) => {
//   if (!params) {
//     return {
//       status: 400,
//       data: "Missing parameters",
//     };
//   }
//   const { id } = await params.params;
//   const body = await req.json();
//   const updated = await updateUser(id, body);

//   if (!updated) {
//     return {
//       status: 404,
//       data: "User not found",
//     };
//   }

//   return {
//     status: 200,
//     data: updated,
//   };
// });

// export const DELETE = withDB(async (req: NextRequest, params?: ApiParams) => {
//   if (!params) {
//     return {
//       status: 400,
//       data: "Missing parameters",
//     };
//   }

//   const { id } = await params.params;
//   const deleted = await deleteUser(id);

//   if (!deleted) {
//     return {
//       status: 404,
//       data: "User not found",
//     };
//   }

//   return {
//     status: 200,
//     data: "User deleted",
//   };
// });
