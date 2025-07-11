import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, ReferenceLine } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart"
import { ArrowUp, Activity, Users, Calendar } from "lucide-react"
import { getTrends } from "../../../apis/dashboard.api"
import type { DashboardTrends } from "../../../apis/dashboard.api"
import { NurseActivities } from "./NurseActivities"

interface ChartData {
  date: string
  rawDate: string
  healthChecks: number
  medicalEvents: number
  consultations: number
  vaccinations: number
}

const DashBoardAdmin = () => {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "3months" | "1year">("7days")
  const [loading, setLoading] = useState<boolean>(true)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [stats, setStats] = useState({
    totalHealthChecks: 0,
    totalMedicalEvents: 0,
    totalConsultations: 0,
    totalVaccinations: 0,
  })

  const formatDate = (dateString: string): string => {
    if (dateString.includes("-") && dateString.length === 7) {
      const [year, month] = dateString.split("-")
      const date = new Date(Number(year), Number(month) - 1)
      return date.toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      })
    }
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
    })
  }

  const transformDataForChart = (data: DashboardTrends): ChartData[] => {
    const dateMap = new Map<string, ChartData>()
    const allDates = new Set<string>()
    const dataTypes = ["healthChecks", "medicalEvents", "consultations", "vaccinations"] as const

    dataTypes.forEach((type) => {
      data[type]?.$values?.forEach((item) => allDates.add(item.date))
    })

    allDates.forEach((date) => {
      dateMap.set(date, {
        date: formatDate(date),
        rawDate: date,
        healthChecks: 0,
        medicalEvents: 0,
        consultations: 0,
        vaccinations: 0,
      })
    })

    dataTypes.forEach((type) => {
      data[type]?.$values?.forEach((item) => {
        const existing = dateMap.get(item.date)
        if (existing) {
          existing[type] = item.count
        }
      })
    })

    return Array.from(dateMap.values()).sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime())
  }

  const calculateStats = (data: DashboardTrends) => {
    const dataTypes = ["healthChecks", "medicalEvents", "consultations", "vaccinations"] as const
    const newStats = {} as any

    dataTypes.forEach((type) => {
      const key = `total${type.charAt(0).toUpperCase() + type.slice(1)}`
      newStats[key] = data[type]?.$values?.reduce((sum, item) => sum + item.count, 0) || 0
    })

    setStats(newStats)
  }

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true)
      try {
        const response = await getTrends(timeRange)
        const data: DashboardTrends = response.data

        const transformedData = transformDataForChart(data)
        setChartData(transformedData)
        calculateStats(data)
      } catch (error) {
        console.error("Error fetching trends data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [timeRange])

  const pieChartData = [
    { name: "Khám sức khỏe", value: stats.totalHealthChecks, fill: "hsl(var(--chart-1))" },
    { name: "Sự kiện y tế", value: stats.totalMedicalEvents, fill: "hsl(var(--chart-2))" },
    { name: "Tư vấn", value: stats.totalConsultations, fill: "hsl(var(--chart-3))" },
    { name: "Tiêm chủng", value: stats.totalVaccinations, fill: "hsl(var(--chart-4))" },
  ].filter((item) => item.value > 0)

  const statisticCards = [
    { title: "Kiểm tra sức khỏe", value: stats.totalHealthChecks, icon: Users, color: "hsl(var(--chart-1))" },
    { title: "Sự kiện y tế", value: stats.totalMedicalEvents, icon: Activity, color: "hsl(var(--chart-2))" },
    { title: "Tư vấn", value: stats.totalConsultations, icon: Calendar, color: "hsl(var(--chart-3))" },
    { title: "Tiêm chủng", value: stats.totalVaccinations, icon: ArrowUp, color: "hsl(var(--chart-4))" },
  ]

  const lineChartConfig = {
    healthChecks: {
      label: "Khám sức khỏe",
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
    vaccinations: {
      label: "Tiêm chủng",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig

  const pieChartConfig = {
    healthChecks: {
      label: "Khám sức khỏe",
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
    vaccinations: {
      label: "Tiêm chủng",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div className="mt-4">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <Select
          value={timeRange}
          onValueChange={(value: "7days" | "30days" | "3months" | "1year") => setTimeRange(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 ngày</SelectItem>
            <SelectItem value="30days">30 ngày</SelectItem>
            <SelectItem value="3months">3 tháng</SelectItem>
            <SelectItem value="1year">1 năm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statisticCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: card.color }}>
                  {card.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo thời gian</CardTitle>
              <CardDescription>Biểu đồ hoạt động y tế theo thời gian</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={lineChartConfig} className="h-[300px] w-[95%] mx-auto">
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 15,
                    left: 15,
                    right: 50,
                    bottom: 15,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={12}
                    fontSize={13}
                    interval={0}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false}
                    fontSize={13}
                    tickMargin={12}
                  />
                  <ReferenceLine
                    x={chartData[0]?.date}
                    stroke="#ccc"
                  />
                  <ReferenceLine
                    x={chartData[chartData.length - 1]?.date}
                    stroke="#ccc"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line
                    dataKey="healthChecks"
                    type="monotone"
                    stroke="var(--color-healthChecks)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-healthChecks)", strokeWidth: 2, r: 3 }}
                    connectNulls={false}
                  />
                  <Line
                    dataKey="medicalEvents"
                    type="monotone"
                    stroke="var(--color-medicalEvents)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-medicalEvents)", strokeWidth: 2, r: 3 }}
                    connectNulls={false}
                  />
                  <Line
                    dataKey="consultations"
                    type="monotone"
                    stroke="var(--color-consultations)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-consultations)", strokeWidth: 2, r: 3 }}
                    connectNulls={false}
                  />
                  <Line
                    dataKey="vaccinations"
                    type="monotone"
                    stroke="var(--color-vaccinations)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-vaccinations)", strokeWidth: 2, r: 3 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Phân bố hoạt động</CardTitle>
              <CardDescription>Tỷ lệ các loại hoạt động y tế</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={0}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <NurseActivities />
    </div>
  )
}

export default DashBoardAdmin