// config/custom-pages.js
// Add your own custom page configurations here

module.exports = {
  // Critical business pages
  critical: [
    { 
      name: 'homepage', 
      path: '/', 
      description: 'Site homepage' 
    },
    { 
      name: 'contact', 
      path: '/contact/', 
      description: 'Contact form' 
    },
    { 
      name: 'about', 
      path: '/about/', 
      description: 'About page' 
    },
    { 
      name: 'pricing', 
      path: '/pricing/', 
      description: 'Pricing page' 
    }
  ],

  // Forms and interactive pages
  forms: [
    { 
      name: 'contact-form', 
      path: '/contact/', 
      description: 'Contact form page' 
    },
    { 
      name: 'quote-request', 
      path: '/quote/', 
      description: 'Quote request form' 
    },
    { 
      name: 'newsletter-signup', 
      path: '/newsletter/', 
      description: 'Newsletter signup' 
    }
  ],

  // Blog and content
  content: [
    { 
      name: 'blog-home', 
      path: '/blog/', 
      description: 'Blog homepage' 
    },
    { 
      name: 'single-post', 
      path: '/blog/test-post/', 
      description: 'Single blog post' 
    },
    { 
      name: 'search-results', 
      path: '/?s=test', 
      description: 'Search results page' 
    }
  ],

  // Custom post types (adjust paths as needed)
  custom_posts: [
    { 
      name: 'portfolio-archive', 
      path: '/portfolio/', 
      description: 'Portfolio listing' 
    },
    { 
      name: 'testimonials', 
      path: '/testimonials/', 
      description: 'Testimonials page' 
    },
    { 
      name: 'team', 
      path: '/team/', 
      description: 'Team members page' 
    }
  ]
};