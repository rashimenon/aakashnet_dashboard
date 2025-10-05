export interface Satellite {
  id: number
  name: string
  type: string
  status: string
  lat: number
  lon: number
  alt: number
  userId: string
  launchDate?: string | null
  description?: string | null
  createdAt: string
  updatedAt: string
}

interface SatelliteFilters {
  search?: string
  type?: string
  status?: string
  limit?: number
  offset?: number
}

class SatelliteService {
  private baseUrl = '/api/satellites'

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bearer_token') : null
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  }

  async getAllSatellites(filters?: SatelliteFilters): Promise<Satellite[]> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.search) params.append('search', filters.search)
      if (filters?.type) params.append('type', filters.type)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.limit) params.append('limit', filters.limit.toString())
      if (filters?.offset) params.append('offset', filters.offset.toString())

      const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch satellites: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching satellites:', error)
      throw error
    }
  }

  async getSatelliteById(id: number): Promise<Satellite> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch satellite: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching satellite:', error)
      throw error
    }
  }

  async createSatellite(data: {
    name: string
    type: string
    status?: string
    lat: number
    lon: number
    alt: number
  }): Promise<Satellite> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create satellite')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating satellite:', error)
      throw error
    }
  }

  async updateSatellite(id: number, data: Partial<{
    name: string
    type: string
    status: string
    lat: number
    lon: number
    alt: number
  }>): Promise<Satellite> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update satellite')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating satellite:', error)
      throw error
    }
  }

  async deleteSatellite(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete satellite')
      }
    } catch (error) {
      console.error('Error deleting satellite:', error)
      throw error
    }
  }

  // Helper methods for statistics
  async getStatistics() {
    const satellites = await this.getAllSatellites({ limit: 100 })
    
    return {
      total: satellites.length,
      active: satellites.filter(s => s.status === 'Active').length,
      testing: satellites.filter(s => s.status === 'Testing').length,
      inactive: satellites.filter(s => s.status === 'Inactive').length,
      byType: satellites.reduce((acc, sat) => {
        acc[sat.type] = (acc[sat.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }
}

export const satelliteService = new SatelliteService()
export type { Satellite, SatelliteFilters }