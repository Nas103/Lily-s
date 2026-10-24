export const ADMIN_RANGES = [7, 14, 30, 90] as const;
export type AdminRange = (typeof ADMIN_RANGES)[number];

export function normalizeRange(value: unknown): AdminRange {
  const num = Number(value);
  return (ADMIN_RANGES as readonly number[]).includes(num) ? (num as AdminRange) : 30;
}

export type SeriesPoint = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
};

export type UsersPoint = {
  date: string;
  label: string;
  users: number;
};

export type NamedCount = {
  key: string;
  label: string;
  count: number;
};

export type TopProduct = {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
};

export type AdminRecentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  userEmail: string | null;
  createdAt: string;
};

export type AdminStats = {
  generatedAt: string;
  range: AdminRange;
  totals: {
    users: number;
    orders: number;
    pending: number;
    revenue: number;
    paidOrders: number;
    avgOrderValue: number;
    editedProducts: number;
    reviews: number;
    avgRating: number;
    rangeRevenue: number;
    rangeOrders: number;
    newUsers: number;
    conversionRate: number;
  };
  revenueSeries: SeriesPoint[];
  usersSeries: UsersPoint[];
  ordersByStatus: NamedCount[];
  paymentByStatus: NamedCount[];
  topProducts: TopProduct[];
  ratingDistribution: NamedCount[];
  recentOrders: AdminRecentOrder[];
};
