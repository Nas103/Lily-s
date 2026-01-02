/**
 * New Products Data Aggregation
 * 
 * This file aggregates all new product data from the mobile-app directory.
 * These products are merged with static products in the API route.
 */

// Import new product data files
// Note: These imports use relative paths from the web app's data directory
// Since the files are in mobile-app/src/data/, we need to use a path that works

// For now, we'll define the products directly here to avoid path issues
// TODO: Consider moving these files to a shared location or using a build step

import type { Product } from '../../mobile-app/src/types';

// Re-export lifestyle products
export { lifestyleProducts } from '../../mobile-app/src/data/lifestyleProducts';

// Re-export running products  
export { runningProducts } from '../../mobile-app/src/data/runningProducts';

// Re-export boxraw products
export { boxrawProducts } from '../../mobile-app/src/data/boxrawProducts';

// Re-export electronics products
export { electronicsProducts } from '../../mobile-app/src/data/electronicsProducts';

// Re-export perfumes products
export { perfumesProducts } from '../../mobile-app/src/data/perfumesProducts';

