export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import connectDB from "@/lib/db";
import User from "@/models/User";

function removeDuplicateNodes(nodes) {
  const seen = new Set();
  const dedupe = (list) =>
    list
      .filter((node) => {
        if (seen.has(node._id)) return false;
        seen.add(node._id);
        return true;
      })
      .map((node) => ({
        ...node,
        children: dedupe(node.children || []),
      }));
  return dedupe(nodes);
}

function sanitizeUser(u) {
  return {
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    employeeId: u.employeeId,
    role: u.role,
    linkId: u.linkId,
    parentLinkId: u.parentLinkId || null,
    allowedModules: (u.allowedModules || []).map((m) => ({
      title: m.title,
      url: m.url,
      _id: m._id ? m._id.toString() : null,
    })),
    children: Array.isArray(u.children) ? u.children.map(sanitizeUser) : [],
  };
}

export async function GET() {
  await connectDB();
  let users = await User.find({}).sort({ createdAt: 1 }).lean();
  users = users.filter((u) => u.role !== "admin");

  const map = {};
  users.forEach((u) => {
    map[u.linkId] = {
      ...u,
      _id: u._id.toString(),
      children: [],
    };
  });

  const tree = [];

  users.forEach((u) => {
    if (u.parentLinkId && map[u.parentLinkId]) {
      map[u.parentLinkId].children.push(map[u.linkId]);
    } else {
      tree.push(map[u.linkId]);
    }
  });

  const cleanTree = removeDuplicateNodes(tree.map(sanitizeUser));

  return Response.json({ userTree: cleanTree });
}
