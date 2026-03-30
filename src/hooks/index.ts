// Authentication hooks
export { useAuth } from "./use-auth";

// Role-based access hooks
export { useRole, useAccess, canAccessAdmin, canModerate, canEdit, canDelete } from "./use-role";

// Async utility hooks
export { useAsync, useAsyncState } from "./use-async";

// API hooks
export {
  useTitles,
  useTitleDetail,
  useTitleReviews,
  useTitleAggregate,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useLikeReview,
  useUnlikeReview,
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useUserProfile,
  useUpdateProfile,
} from "./use-api";

// Payment hooks
export {
  useStripeCheckout,
  useSubscriptionStatus,
  useCancelSubscription,
  useSSLCommerceCheckout,
  usePaymentHistory,
} from "./use-payments";

// Types
export type { AuthUser, AuthState } from "./use-auth";
export type {
  Title,
  TitleDetail,
  Review,
  PaginationParams,
} from "./use-api";
export type { StripeSession, Subscription } from "./use-payments";
export type { UseAsyncState } from "./use-async";
