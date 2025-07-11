import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart"
import { useEffect, useState } from "react"
import { getNurseActivity, Nurse } from "../../../apis/dashboard.api"
import { getNurseListForHealthConsultation } from "../../../apis/healthConsultationBooking.api"

interface ChartData {
  date: string
  rawDate: string
  healthChecks: number
  medicalEvents: number
  consultations: number
  vaccinations: number
}

const chartConfig = {
  total: {
    label: "Tổng hoạt động",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function NurseActivities() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nurseRes = await getNurseListForHealthConsultation()
        const nurses = nurseRes.data.$values
        const data = await Promise.all(
          nurses.map(async (nurse : Nurse) => {
            const activityRes = await getNurseActivity(nurse.accountID)
            const activity = activityRes.data
            return {
              nurseName: nurse.fullname,
              healthChecks: activity.workloadDistribution.healthChecks,
              medicalEvents: activity.workloadDistribution.medicalEvents,
              consultations: activity.workloadDistribution.consultations,
              medicationApprovals: activity.workloadDistribution.medicationApprovals
            }
          })
        )

        console.log(data)
        setChartData(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động của y tá</CardTitle>
        <CardDescription>Thống kê công việc của các y tá trong tháng này</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} layout="vertical" margin={{ right: 16 }}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="nurseName" type="category" hide />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="total" layout="vertical" fill="var(--color-total)" radius={4}>
              <LabelList dataKey="nurseName" position="insideLeft" offset={8} fontSize={12} />
              <LabelList dataKey="total" position="right" offset={8} fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default NurseActivities