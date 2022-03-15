---
layout: tag
pagination:
  data: collections.categories
  size: 1
  alias: tag
permalink: '/tags/{{pagination.items[0] | slug}}/'
eleventyExcludeFromCollections: true

---

This page is cloned for each tag and will display the products or articles containing the current tag.

This page uses the layout: `{{ layout }}`

