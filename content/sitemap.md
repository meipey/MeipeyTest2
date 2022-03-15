---
permalink: /sitemap.xml
layout: null
eleventyExcludeFromCollections: true
---
{% if site.url != '' %}
{% sitemap collections.sitemap %}
{% endif %}
