import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart"
import { useEffect, useState } from "react"
import { getNurseActivity } from "../../../apis/dashboard.api"
import { getNurseListForHealthConsultation } from "../../../apis/healthConsultationBooking.api"

interface ChartData {
  nurseName: string
  healthChecks: number
  medicalEvents: number
  consultations: number
  medicationApprovals: number
  total: number
}

const chartConfig = {
  healthChecks: {
    label: "Kiểm tra sức khỏe",
    color: "hsl(var(--chart-1))",
  },
  medicalEvents: {
    label: "Sự kiện y tế",
    color: "hsl(var(--chart-2))",
  },
  consultations: {
    label: "Tư vấn",
    color: "hsl(var(--chart-3))",
  },
  medicationApprovals: {
    label: "Duyệt thuốc",
    color: "hsl(var(--chart-4))",
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
        console.log(nurses)

        const data: ChartData[] = []
        for (const nurse of nurses) {
          try {
            const activityRes = await getNurseActivity(nurse.accountID)
            const activity = activityRes.data
            const distribution = activity.workloadDistribution

            const entry: ChartData = {
              nurseName: nurse.fullname,
              healthChecks: distribution?.healthChecks || 0,
              medicalEvents: distribution?.medicalEvents || 0,
              consultations: distribution?.consultations || 0,
              medicationApprovals: distribution?.medicationApprovals || 0,
              total:
                (distribution?.healthChecks || 0) +
                (distribution?.medicalEvents || 0) +
                (distribution?.consultations || 0) +
                (distribution?.medicationApprovals || 0)
            }

            data.push(entry)
          } catch (error) {
            console.log(`Ko fetch duoc ${nurse.fullname}:`, error)
          }
        }
        console.log(data)
        setChartData(data)
      } catch (error) {
        console.log(error)
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
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle>Hoạt động của y tá</CardTitle>
        <CardDescription>Thống kê công việc của các y tá trong tháng này</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 mt-2">
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 120, right: 50, top: 0, bottom: 0 }}
            barGap={0}
            barSize={30}
          >
            <YAxis dataKey="nurseName" type="category" hide />
            <XAxis type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="healthChecks" stackId="a" fill="var(--color-healthChecks)" radius={[0, 0, 0, 0]}>
              <LabelList dataKey="nurseName" position="insideLeft" offset={8} fontSize={12} fill="white" />
            </Bar>
            <Bar dataKey="medicalEvents" stackId="a" fill="var(--color-medicalEvents)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="consultations" stackId="a" fill="var(--color-consultations)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="medicationApprovals" stackId="a" fill="var(--color-medicationApprovals)" radius={[0, 4, 4, 0]}>
              <LabelList dataKey="total" position="right" offset={8} fontSize={12} fill="currentColor" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default NurseActivities