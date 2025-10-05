// src/lib/role-home.ts
export type Role = "Administrator" | "Admin" | "Army" | "Defense" | "Consumer" | "Public" | string | undefined

export function roleHomePath(role: Role) {
  const r = (role ?? "").toLowerCase()
  if (r === "administrator" || r === "admin") return "/admin/dashboard"
  if (r === "army" || r === "defense") return "/army/dashboard"
  // default for public/consumer/unknown
  return "/consumer/dashboard"
}
