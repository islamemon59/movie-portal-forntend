"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { buildQueryString, extractResponseData } from "@/lib/api-utils";

// Movie/Title types
export interface Title {
  id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl: string;
  trailerUrl?: string;
  releaseDate: string;
  rating: number;
  genres?: string[];
  platforms?: string[];
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TitleDetail extends Title {
  reviews?: Review[];
  aggregateRating?: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface Review {
  id: string;
  titleId: string;
  userId: string;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  sort?: string;
}

/**
 * Hook to fetch all titles/movies
 */
export const useTitles = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["titles", params],
    queryFn: async () => {
      const query = buildQueryString(params);
      const response = await http.get<{ data: Title[] }>(`/titles?${query}`);
      return extractResponseData<Title[]>(response.data);
    },
  });
};

/**
 * Hook to fetch a single title by ID
 */
export const useTitleDetail = (titleId: string | null | undefined) => {
  return useQuery({
    queryKey: ["title", titleId],
    queryFn: async () => {
      if (!titleId) throw new Error("Title ID is required");
      const response = await http.get<TitleDetail>(`/titles/${titleId}`);
      return extractResponseData<TitleDetail>(response.data);
    },
    enabled: !!titleId,
  });
};

/**
 * Hook to fetch reviews for a title
 */
export const useTitleReviews = (
  titleId: string | null | undefined,
  params?: { status?: "APPROVED"; page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: ["titleReviews", titleId, params],
    queryFn: async () => {
      if (!titleId) throw new Error("Title ID is required");

      const query = buildQueryString(params);
      const response = await http.get<{ data: Review[] }>(
        `/titles/${titleId}/reviews?${query}`
      );
      return extractResponseData<Review[]>(response.data);
    },
    enabled: !!titleId,
  });
};

/**
 * Hook to fetch title aggregate rating
 */
export const useTitleAggregate = (titleId: string | null | undefined) => {
  return useQuery({
    queryKey: ["titleAggregate", titleId],
    queryFn: async () => {
      if (!titleId) throw new Error("Title ID is required");
      const response = await http.get(`/titles/${titleId}/aggregate`);
      return extractResponseData(response.data);
    },
    enabled: !!titleId,
  });
};

/**
 * Factory function to create review mutation hooks
 * Reduces duplication between create, update, and delete
 */
function createReviewMutation<T>(
  mutationFn: (data: T) => Promise<any>,
  invalidateKeys: string[] = ["titleReviews", "titleAggregate"]
) {
  return () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn,
      onSuccess: () => {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      },
    });
  };
}

/**
 * Hook to create a review
 */
export const useCreateReview = createReviewMutation(
  async (data: { titleId: string; rating: number; comment: string }) => {
    const response = await http.post("/titles/reviews", data);
    return extractResponseData(response.data);
  }
);

/**
 * Hook to update a review
 */
export const useUpdateReview = createReviewMutation(
  async (payload: {
    reviewId: string;
    data: { rating?: number; comment?: string };
  }) => {
    const response = await http.patch(`/reviews/${payload.reviewId}`, payload.data);
    return extractResponseData(response.data);
  }
);

/**
 * Hook to delete a review
 */
export const useDeleteReview = createReviewMutation(
  async (reviewId: string) => {
    await http.delete(`/reviews/${reviewId}`);
  }
);

/**
 * Factory function to create generic mutation hooks
 * Reduces boilerplate for similar mutations
 */
function createGenericMutation<T = any>(
  mutationFn: (data: T) => Promise<any>,
  onSuccessInvalidate?: string | string[] | ((data: any) => string | string[])
) {
  return () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn,
      onSuccess: (data) => {
        const keys = typeof onSuccessInvalidate === "function"
          ? onSuccessInvalidate(data)
          : onSuccessInvalidate;

        if (keys) {
          const keysArray = Array.isArray(keys) ? keys : [keys];
          keysArray.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: [key] });
          });
        }
      },
    });
  };
}

/**
 * Hook to like a review
 */
export const useLikeReview = createGenericMutation(
  async (reviewId: string) => {
    const response = await http.post(`/reviews/${reviewId}/like`);
    return extractResponseData(response.data);
  },
  "titleReviews"
);

/**
 * Hook to unlike a review
 */
export const useUnlikeReview = createGenericMutation(
  async (reviewId: string) => {
    await http.delete(`/reviews/${reviewId}/like`);
  },
  "titleReviews"
);

/**
 * Hook to fetch watchlist
 */
export const useWatchlist = () => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const response = await http.get("/watchlist");
      return extractResponseData(response.data);
    },
  });
};

/**
 * Hook to add title to watchlist
 */
export const useAddToWatchlist = createGenericMutation(
  async (titleId: string) => {
    const response = await http.post("/watchlist", { titleId });
    return extractResponseData(response.data);
  },
  "watchlist"
);

/**
 * Hook to remove title from watchlist
 */
export const useRemoveFromWatchlist = createGenericMutation(
  async (titleId: string) => {
    await http.delete(`/watchlist/${titleId}`);
  },
  "watchlist"
);

/**
 * Hook to fetch user profile
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await http.get("/users/me");
      return extractResponseData(response.data);
    },
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = createGenericMutation(
  async (data: { name?: string; image?: string }) => {
    const response = await http.patch("/users/me", data);
    return extractResponseData(response.data);
  },
  "userProfile"
);
