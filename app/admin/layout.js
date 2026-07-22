import { AdminProvider } from '@/components/admin/AdminProvider'

export const metadata = { title: 'CMS · VayuCodes' }

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <AdminProvider>
        {children}
      </AdminProvider>
    </div>
  )
}
