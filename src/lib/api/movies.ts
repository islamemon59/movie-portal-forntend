import { http } from "@/lib/http";
import { Title } from "@/hooks/use-api";

/**
 * Fetch movies with fallback data
 * @deprecated Use useTitles hook instead
 */
export async function getMovies(): Promise<Title[]> {
  try {
    const response = await http.get("/titles");
    
    // Extract data from response
    if (response.data?.data) {
      return response.data.data;
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return [];
  }
}
