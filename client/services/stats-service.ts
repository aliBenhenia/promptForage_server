import api from '@/lib/api';

interface DailyUsage {
  date: string;
  count: number;
}

export interface UsageStats {
  dailyUsage: DailyUsage[];
  totalRequests: number;
  requestsToday: number;
  requestLimit: number;
}

export const statsService = {
  async getUserStats(): Promise<UsageStats> {
    // In a real implementation, this would call the backend API
    // For now, we'll use simulated data
    
    // Uncomment below when backend is ready
    // const response = await api.get('/stats/usage');
    // return response.data;
    
    // Generate the last 7 days
    const days = 7;
    const dailyUsage: DailyUsage[] = [];
    const now = new Date();
    let totalRequests = 0;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate random count between 5 and 30
      const count = Math.floor(Math.random() * 25) + 5;
      totalRequests += count;
      
      dailyUsage.push({
        date: date.toISOString().split('T')[0],
        count,
      });
    }
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dailyUsage,
          totalRequests,
          requestsToday: dailyUsage[dailyUsage.length - 1].count,
          requestLimit: 1000,
        });
      }, 500);
    });
  },
};