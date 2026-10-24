import { prisma } from "@/lib/prisma";
import { catalogProducts } from "@/data/catalog";
import { products as staticProducts } from "@/data/products";
import { loadProductOverrides } from "@/lib/productOverrides";
import { logSync } from "./store";

const db = () => (prisma as any);

const normalizePrice = (price: any): number => {
  if (price === null || price === undefined) return 0;
  const n = typeof price === "number" ? price : parseFloat(String(price));
  return Number.isFinite(n) ? n : 0;
};

const normalizeArray = (arr?: any): string[] => (Array.isArray(arr) ? arr.filter(Boolean).map((v) => String(v)) : []);

export async function syncKnowledgeLibrary(triggeredBy?: string): Promise<{ entries: number }> {
  if (!prisma) return { entries: 0 };
  let count = 0;
  try {
    const overrides = await loadProductOverrides();

    // Load mobile catalog
    let mobileProducts: any[] = [];
    try {
      const [
        { womenProducts },
        { menProducts },
        { lifestyleProducts },
        { runningProducts },
        { boxrawProducts },
        { electronicsProducts },
        { perfumesProducts },
        { featuredProducts },
      ] = await Promise.all([
        import("../../../mobile-app/src/data/womenProducts"),
        import("../../../mobile-app/src/data/menProducts"),
        import("../../../mobile-app/src/data/lifestyleProducts"),
        import("../../../mobile-app/src/data/runningProducts"),
        import("../../../mobile-app/src/data/boxrawProducts"),
        import("../../../mobile-app/src/data/electronicsProducts"),
        import("../../../mobile-app/src/data/perfumesProducts"),
        import("../../../mobile-app/src/data/featuredProducts"),
      ]);
      mobileProducts = [
        ...(womenProducts || []),
        ...(menProducts || []),
        ...(lifestyleProducts || []),
        ...(runningProducts || []),
        ...(boxrawProducts || []),
        ...(electronicsProducts || []),
        ...(perfumesProducts || []),
        ...(featuredProducts || []),
      ];
    } catch (e) {
      console.warn("[ai-knowledge] mobile catalog load failed", e);
    }

    const merged = new Map<string, any>();
    for (const p of [...(staticProducts as any[]), ...mobileProducts, ...(catalogProducts as any[])]) {
      if (!p?.id) continue;
      merged.set(String(p.id), { ...p });
    }

    if (prisma) {
      try {
        const rows = await db().product.findMany({
          where: { status: "ACTIVE", AND: [{ OR: [{ brandId: null }, { brand: { status: "APPROVED" } }] }] },
          include: { category: true, brand: true },
        });
        for (const row of rows) {
          merged.set(String(row.id), {
            id: String(row.id),
            name: row.name,
            slug: row.slug,
            description: row.description,
            category: row.category?.name || row.category?.slug || row.categoryId,
            subCategory: row.subCategory,
            gender: row.gender,
            price: row.price,
            sizes: Array.isArray(row.sizes) ? row.sizes : [],
            colors: Array.isArray(row.colors) ? row.colors : [],
            brand: row.brand?.name || null,
            brandId: row.brandId || null,
            discountPercent: row.discountPercent,
            badge: row.badge,
            tags: row.tags,
            highlight: row.highlight,
          });
        }
      } catch (e) {
        console.warn("[ai-knowledge] db products load failed", e);
      }
    }

    // Sync products
    for (const [id, product] of merged) {
      const ov = overrides.get(id);
      const basePrice = normalizePrice(ov?.price ?? product.price);
      const discount = normalizePrice(ov?.discountPercent ?? product.discountPercent);
      const price = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      const name = ov?.name ?? product.name;
      const sizes = normalizeArray(ov?.soldOutSizes ? [] : product.sizes);
      const colors = normalizeArray(product.colors);
      const soldOutSizes = normalizeArray(ov?.soldOutSizes as any);
      const soldOutColors = normalizeArray(ov?.soldOutColors as any);
      const category = typeof product.category === "string" ? product.category : product.category?.name || product.category?.slug || "";
      const subCategory = product.subCategory || "";
      const gender = product.gender || "";
      const brand = product.brand || product.brandId || "";
      const slug = product.slug || id;

      const content = [
        `Product: ${name}`,
        `ID: ${id}`,
        `Slug: ${slug}`,
        `URL: /product/${slug}`,
        `Price: USD $${price.toFixed(2)}${discount > 0 ? ` (was $${basePrice.toFixed(2)}, ${discount}% off)` : ""}`,
        category ? `Category: ${category}${subCategory ? "/" + subCategory : ""}` : "",
        gender ? `Gender: ${gender}` : "",
        brand ? `Brand: ${brand}` : "",
        product.highlight ? `Highlight: ${product.highlight}` : "",
        product.badge ? `Badge: ${product.badge}` : "",
        product.description ? `Description: ${product.description}` : "",
        sizes.length ? `Available sizes: ${sizes.join(", ")}` : "",
        colors.length ? `Available colors: ${colors.join(", ")}` : "",
        soldOutSizes.length ? `Sold out sizes: ${soldOutSizes.join(", ")}` : "",
        soldOutColors.length ? `Sold out colors: ${soldOutColors.join(", ")}` : "",
        product.tags?.length ? `Tags: ${product.tags.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const tags = [
        "product",
        category,
        subCategory,
        gender,
        brand,
        ...(product.tags || []),
      ].filter(Boolean);

      await db().knowledgeEntry.upsert({
        where: { id: `prod_${id}` },
        update: {
          title: name,
          content,
          tags,
          slug: `/product/${slug}`,
          productId: id,
          category,
          brandId: product.brandId || null,
          isActive: true,
          version: { increment: 1 },
          updatedAt: new Date(),
          metadata: { price, basePrice, discount, sizes, colors, soldOutSizes, soldOutColors },
        },
        create: {
          id: `prod_${id}`,
          sourceType: "product",
          sourceId: id,
          title: name,
          content,
          tags,
          slug: `/product/${slug}`,
          productId: id,
          category,
          brandId: product.brandId || null,
          isActive: true,
          version: 1,
          metadata: { price, basePrice, discount, sizes, colors, soldOutSizes, soldOutColors },
        },
      });
      count++;
    }

    // Sync brands
    try {
      const brands = await db().brand.findMany({ where: { status: "APPROVED" }, include: { user: true, products: { where: { status: "ACTIVE" }, take: 20 } } });
      for (const brand of brands) {
        const content = [
          `Brand: ${brand.name}`,
          brand.slug ? `Slug: ${brand.slug}` : "",
          brand.description ? `Description: ${brand.description}` : "",
          brand.website ? `Website: ${brand.website}` : "",
          brand.country ? `Country: ${brand.country}` : "",
          `Products: ${brand.products?.length || 0} active products listed`,
        ]
          .filter(Boolean)
          .join("\n");
        await db().knowledgeEntry.upsert({
          where: { id: `brand_${brand.id}` },
          update: { title: brand.name, content, tags: ["brand", brand.name.toLowerCase()], brandId: brand.id, isActive: true, version: { increment: 1 }, updatedAt: new Date() },
          create: { id: `brand_${brand.id}`, sourceType: "brand", sourceId: brand.id, title: brand.name, content, tags: ["brand", brand.name.toLowerCase()], brandId: brand.id, isActive: true, version: 1 },
        });
        count++;
      }
    } catch (e) {
      console.warn("[ai-knowledge] brand sync failed", e);
    }

    // Sync categories
    try {
      const categories = await db().category.findMany();
      for (const cat of categories) {
        const content = `Category: ${cat.name} (${cat.slug})`;
        await db().knowledgeEntry.upsert({
          where: { id: `cat_${cat.id}` },
          update: { title: cat.name, content, tags: ["category", cat.slug], category: cat.slug, isActive: true, version: { increment: 1 }, updatedAt: new Date() },
          create: { id: `cat_${cat.id}`, sourceType: "category", sourceId: cat.id, title: cat.name, content, tags: ["category", cat.slug], category: cat.slug, isActive: true, version: 1 },
        });
        count++;
      }
    } catch (e) {
      console.warn("[ai-knowledge] category sync failed", e);
    }

    // Policies/FAQs
    const staticEntries = [
      { id: "policy_shipping", title: "Shipping Policy", content: "Standard shipping 5-7 business days; Express 2-3 business days; free shipping over $75. Tracking available.", tags: ["policy", "shipping"] },
      { id: "policy_returns", title: "Returns Policy", content: "30-day returns on unworn items with tags attached. Visit Support page for return instructions.", tags: ["policy", "returns"] },
      { id: "policy_support", title: "Support", content: "Visit /support for assistance. AI assistant can help with sizing, styling, shipping, returns.", tags: ["policy", "support"] },
    ];
    for (const se of staticEntries) {
      await db().knowledgeEntry.upsert({
        where: { id: se.id },
        update: { title: se.title, content: se.content, tags: se.tags, isActive: true, version: { increment: 1 }, updatedAt: new Date() },
        create: { id: se.id, sourceType: "policy", title: se.title, content: se.content, tags: se.tags, isActive: true, version: 1 },
      });
      count++;
    }

    await logSync(triggeredBy, "success", count, { at: new Date().toISOString() });
    return { entries: count };
  } catch (error) {
    console.error("[ai-knowledge] sync failed", error);
    await logSync(triggeredBy, "failed", count, { error: String(error) });
    return { entries: count };
  }
}
