const site =  require('./_data/site.js')
const {imageShortcode, bgImageShortcode} = require('./optimize')

module.exports = function(eleventyConfig) {
  // shortcodes
  eleventyConfig.addLiquidShortcode("image", imageShortcode)
  eleventyConfig.addLiquidShortcode("bg-image", bgImageShortcode)
  // sitemap collection (all but some paths)
  eleventyConfig.addCollection("sitemap", function(collectionApi) {
    return collectionApi.getAll()
    .filter(item => {
      return !!item.data.permalink // filter out /admin/ and /README/
        && item.outputPath.endsWith('.html') // filter out css files
    })
  })
  // sitemap plugin
  const sitemap = require("@quasibit/eleventy-plugin-sitemap")
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: site.url + site.baseurl,
    },
  })
  if(!site.url) {
    console.warn('WARNING: Sitemap will be empty because the env var `URL` is missing.')
  }
  // collection
  eleventyConfig.addCollection('categories', function(collectionApi) {
    const tags = collectionApi.getAll()
      .flatMap(item => item.data.categories)
      .filter(tag => !!tag)
    // remove duplicates using Set
    return [...new Set(tags)]
  })
  // slideshow include
  eleventyConfig.addPassthroughCopy({
    'node_modules/@splidejs/splide/dist/js': 'js',
    'node_modules/@splidejs/splide/dist/css': 'css',
  })
  // modernizr library
  // you need to add modernizr script to your editable.html file, see README.md
  eleventyConfig.addPassthroughCopy({
    'modernizr.js': 'js/modernizr.js',
  })
  // copy folders
  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addPassthroughCopy('uploads')
  eleventyConfig.addPassthroughCopy('images')
  eleventyConfig.addPassthroughCopy('css/*.css')
  eleventyConfig.addPassthroughCopy('css/*.jpg') // favicon
  eleventyConfig.addPassthroughCopy('css/*.png') // favicon
  eleventyConfig.addPassthroughCopy('css/*.ico') // favicon
  eleventyConfig.addPassthroughCopy('js')
  eleventyConfig.addPassthroughCopy('CNAME')
  eleventyConfig.addPassthroughCopy('.htaccess')

  // other config
  return {
    dir: {
      layouts: '_layouts',
      includes: '_includes',
    },
  }
}
