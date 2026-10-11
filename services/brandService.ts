import { Brand, BrandSustainability } from '@/types';
import { db } from './db';

/**
 * Service layer for Brand domain operations.
 * Wraps persistent storage / Supabase client queries.
 */
export const brandService = {
  /**
   * Get all brands in the platform database
   */
  async getAllBrands(): Promise<Brand[]> {
    return db.getBrands();
  },

  /**
   * Get single brand by unique ID
   */
  async getBrandById(id: string): Promise<Brand | undefined> {
    const brands = db.getBrands();
    return brands.find((b) => b.id === id);
  },

  /**
   * Update brand profile data
   */
  async updateBrand(updated: Brand): Promise<Brand> {
    db.saveBrand(updated);
    return updated;
  },

  /**
   * Update brand sustainability records (Water Emission & Diaper inventory tracking)
   */
  async updateSustainability(
    brandId: string,
    sustainability: BrandSustainability
  ): Promise<Brand | undefined> {
    return db.updateBrandSustainability(brandId, sustainability);
  },

  /**
   * Get all active campaigns for a brand
   */
  async getBrandCampaigns(brandId: string) {
    const campaigns = db.getCampaigns();
    return campaigns.filter((c) => c.brandId === brandId);
  },
};
