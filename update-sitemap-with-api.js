import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');

// Function to fetch categories from API
async function fetchCategories() {
  try {
    // Use the API endpoint to fetch categories
    const response = await fetch('/api/categories');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    
    const categories = await response.json();
    console.log(`Successfully fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Function to update sitemap with categories and pages from API
async function updateSitemapWithApi() {
  try {
    // Fetch categories from API
    const categories = await fetchCategories();
    
    
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://airbrush.ai/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Add categories to sitemap
    if (categories && categories.length > 0) {
      console.log(`Adding ${categories.length} categories to sitemap`);
      categories.forEach(category => {
        sitemapContent += `
  <url>
    <loc>https://airbrush.ai/${category.slug || category._id}</loc>
    <lastmod>${new Date(category.updatedAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    } else {
      console.log('No categories found for sitemap');
    }

    sitemapContent += '\n</urlset>';
    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log('Sitemap updated successfully!');
  } catch (error) {
    console.error('Error updating sitemap:', error);
  }
}

// Execute the function
updateSitemapWithApi();