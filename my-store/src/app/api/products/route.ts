import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { products as staticProducts } from '@/data/products'

const mapStaticProduct = (products: typeof staticProducts) =>
  products.map((product) => ({
    ...product,
    category: {
      name: product.category,
      slug: product.category,
    },
  }))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') ?? undefined
  const category = searchParams.get('category') ?? undefined

  if (!process.env.DATABASE_URL || !prisma) {
    const filtered = staticProducts.filter((product) => {
      const matchesCategory = category ? product.category === category : true
      const matchesSearch = search
        ? `${product.name} ${product.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true
      return matchesCategory && matchesSearch
    })
    return NextResponse.json(mapStaticProduct(filtered))
  }

  const products = await (prisma as any).product.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && {
        category: {
          slug: category,
        },
      }),
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!products.length) {
    return NextResponse.json(mapStaticProduct(staticProducts))
  }

  return NextResponse.json(products)
}


