import { Sidebar } from '@/src/components/ui/sidebar'
import { Select } from './ui/select'

interface ProductSidebarProps {
    categories: string[]
    selectedCategory: string
    onSelectCategory: (category: string) => void
}

