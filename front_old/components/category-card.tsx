import type { ReactNode } from "react"

interface CategoryCardProps {
  icon: ReactNode
  title: string
  count: string
  color: string
}

export default function CategoryCard({ icon, title, count, color }: CategoryCardProps) {
  return (
    <div className="category-card bg-gray-50 p-6 rounded-xl transition cursor-pointer hover:shadow-md">
      <div className={`category-icon text-4xl ${color} mb-4 transition`}>{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{count} vakansiya</p>
    </div>
  )
}

