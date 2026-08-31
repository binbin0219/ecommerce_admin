import { IconChartBar } from '@tabler/icons-react'

const PLACEHOLDER_METRICS = ['Total Revenue', 'Orders', 'Products', 'Customers']

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-textSec">Dashboard</h1>
        <p className="text-textPri mt-1">Overview of your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLACEHOLDER_METRICS.map(label => (
          <div key={label} className="bg-bgSec p-6 rounded-xl border border-borderPri">
            <p className="text-textPri text-sm mb-2">{label}</p>
            <p className="text-3xl font-bold text-textSec/40 mb-1">—</p>
            <p className="text-xs text-textPri">Available once the API is connected</p>
          </div>
        ))}
      </div>

      <div className="bg-bgSec rounded-xl border border-borderPri p-10 flex flex-col items-center text-center gap-3">
        <IconChartBar size={40} className="text-textPri" />
        <h2 className="text-lg font-semibold text-textSec">Analytics coming soon</h2>
        <p className="text-sm text-textPri max-w-md">
          Revenue, orders and customer metrics will appear here once the backend API is
          ready. Product management is available now from the sidebar.
        </p>
      </div>
    </div>
  )
}
