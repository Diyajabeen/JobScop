import { useEffect, useState } from "react"
import axios from "axios"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

export default function App() {

  const [count, setCount] = useState(0)
  const [data, setData] = useState([])
  const [analyticsData, setAnalyticsData] = useState([])
  const [pieData, setPieData] = useState([])
  const [insights, setInsights] = useState([])
  const [prediction, setPrediction] = useState(0)
  const [search, setSearch] = useState("")

  useEffect(() => {

    // Count API
    axios.get("http://127.0.0.1:8000/count")
      .then((response) => {
        setCount(response.data.total_rows)
      })

    // Dataset API
    axios.get("http://127.0.0.1:8000/data")
      .then((response) => {
        setData(response.data)
      })

    // Analytics API
    axios.get("http://127.0.0.1:8000/top-states")
      .then((response) => {
        setAnalyticsData(response.data)
      })

    // Pie Chart API
    axios.get("http://127.0.0.1:8000/export-distribution")
      .then((response) => {
        setPieData(response.data)
      })

    // AI Insights API
    axios.get("http://127.0.0.1:8000/ai-insights")
      .then((response) => {
        setInsights(response.data)
      })

    // ML Prediction API
    axios.get("http://127.0.0.1:8000/prediction")
      .then((response) => {
        setPrediction(response.data.future_prediction)
      })

  }, [])

  const COLORS = ["#06b6d4", "#8b5cf6"]

  // PDF Download
  const downloadPDF = () => {

    const input = document.getElementById("dashboard")

    html2canvas(input).then((canvas) => {

      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("p", "mm", "a4")

      const pdfWidth = pdf.internal.pageSize.getWidth()

      const pdfHeight =
        (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      )

      pdf.save("JobScopeAI_Report.pdf")

    })

  }

  // Search Filter
  const filteredData = data.filter((row) =>
    JSON.stringify(row)
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#111827] p-6 hidden lg:block border-r border-gray-800">

        <h1 className="text-3xl font-bold text-cyan-400 mb-12">
          JobScope AI
        </h1>

        <ul className="space-y-6 text-lg">

          <li className="text-cyan-400 font-semibold">
            Dashboard
          </li>

          <li className="text-gray-400 hover:text-white cursor-pointer transition">
            Analytics
          </li>

          <li className="text-gray-400 hover:text-white cursor-pointer transition">
            Reports
          </li>

          <li className="text-gray-400 hover:text-white cursor-pointer transition">
            AI Insights
          </li>

        </ul>

      </div>

      {/* Main Content */}
      <div
        id="dashboard"
        className="flex-1 p-6 lg:p-8 overflow-auto"
      >

        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 mb-10">

          <div>

            <h2 className="text-4xl font-bold">
              Dashboard
            </h2>

            <p className="text-gray-400 mt-2">
              AI-powered analytics overview
            </p>

          </div>

          {/* Header Actions */}
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}
            <input
              type="text"
              placeholder="Search dataset..."
              className="bg-[#1e293b] px-5 py-3 rounded-xl outline-none w-full md:w-80 border border-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Download Button */}
            <button
              onClick={downloadPDF}
              className="bg-cyan-500 hover:bg-cyan-600 transition px-6 py-3 rounded-xl font-semibold"
            >
              Download Report
            </button>

          </div>

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-gray-800">

            <h3 className="text-gray-400 text-lg">
              Total Records
            </h3>

            <p className="text-5xl font-bold mt-4">
              {count}
            </p>

          </div>

          <div className="bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-gray-800">

            <h3 className="text-gray-400 text-lg">
              Top Sector
            </h3>

            <p className="text-5xl font-bold mt-4 text-cyan-400">
              AI
            </p>

          </div>

          <div className="bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-gray-800">

            <h3 className="text-gray-400 text-lg">
              Top Skill
            </h3>

            <p className="text-5xl font-bold mt-4 text-purple-400">
              Python
            </p>

          </div>

        </div>

        {/* ML Prediction */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 rounded-2xl shadow-lg mb-10">

          <h2 className="text-3xl font-bold mb-4">
            AI Trend Prediction
          </h2>

          <p className="text-xl">
            Predicted Future Export Value
          </p>

          <p className="text-6xl font-bold mt-4">
            {prediction}
          </p>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">

          {/* Bar Chart */}
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-lg border border-gray-800">

            <h3 className="text-2xl font-bold mb-6">
              Top States Analytics
            </h3>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={analyticsData}>

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="jobs"
                  fill="#06b6d4"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* Pie Chart */}
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-lg border border-gray-800">

            <h3 className="text-2xl font-bold mb-6">
              Export Distribution
            </h3>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >

                  {pieData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* AI Insights */}
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-lg mb-10 border border-gray-800">

          <h3 className="text-2xl font-bold mb-6 text-cyan-400">
            AI Insights
          </h3>

          <div className="space-y-4">

            {insights.map((item, index) => (

              <div
                key={index}
                className="bg-[#273549] p-4 rounded-xl border border-gray-700"
              >

                <p className="text-lg">
                  {item}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Dataset Table */}
        <div className="bg-[#1e293b] rounded-2xl p-6 overflow-auto shadow-lg border border-gray-800">

          <h3 className="text-2xl font-bold mb-6">
            Dataset Preview
          </h3>

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-gray-700">

                {filteredData.length > 0 &&
                  Object.keys(filteredData[0]).map((key) => (

                    <th
                      key={key}
                      className="text-left py-4 px-4 whitespace-nowrap"
                    >
                      {key}
                    </th>

                  ))
                }

              </tr>

            </thead>

            <tbody>

              {filteredData.map((row, index) => (

                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-[#273549] transition"
                >

                  {Object.values(row).map((value, i) => (

                    <td
                      key={i}
                      className="py-4 px-4 whitespace-nowrap"
                    >
                      {value}
                    </td>

                  ))}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}