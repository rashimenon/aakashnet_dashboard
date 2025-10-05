export async function GET() {
  try {
    // Return mock statistics with 500 satellites
    const stats = {
      activeSatellites: 500, // Updated to match 500 satellites
      successRate: 98.5,
      completedMissions: 156,
      upcomingLaunches: 12
    }

    return Response.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}