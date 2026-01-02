# Perfumes Product Images

## Folder Structure

```
perfumes/
├── men/
│   ├── product-001/
│   │   └── main.jpg          # Main product image
│   ├── product-002/
│   │   └── main.jpg
│   └── ... (up to product-015)
│
└── women/
    ├── product-001/
    │   └── main.jpg          # Main product image
    ├── product-002/
    │   └── main.jpg
    └── ... (up to product-020)
```

## Image Requirements

- **Men's Perfumes**: 15 products
- **Women's Perfumes**: 20 products
- **Format**: `.jpg` or `.png`
- **Recommended Size**: 800x800px or larger (square format works best)

## Current Image URLs

### Men's Perfumes
All men's perfumes currently use:
`https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0`

### Women's Perfumes
All women's perfumes currently use:
`https://tse4.mm.bing.net/th/id/OIP.AhpOQz6R-ClR1SdY_9jmqAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3`

## Replacing with Local Images

After uploading images to the folders above, update `src/data/perfumesProducts.ts`:

```typescript
// Before (URL):
imageUrl: 'https://th.bing.com/th/id/R.7eef3239e23d9645f0175c0841a1e2c2?rik=ZvBHDkfVIhYF%2fA&pid=ImgRaw&r=0',

// After (Local):
imageUrl: require('../../assets/images/products/perfumes/men/product-001/main.jpg'),
```

See `assets/images/README.md` for complete instructions.

