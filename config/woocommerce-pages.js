// config/woocommerce-pages.js
// WooCommerce specific page configurations

module.exports = {
  // Shopping experience
  shopping: [
    { 
      name: 'shop-home', 
      path: '/shop/', 
      description: 'Main shop page' 
    },
    { 
      name: 'product-category', 
      path: '/product-category/clothing/', 
      description: 'Product category listing' 
    },
    { 
      name: 'single-product', 
      path: '/product/test-product/', 
      description: 'Individual product page' 
    },
    { 
      name: 'cart', 
      path: '/cart/', 
      description: 'Shopping cart' 
    },
    { 
      name: 'checkout', 
      path: '/checkout/', 
      description: 'Checkout process' 
    },
    { 
      name: 'shop-search', 
      path: '/shop/?s=test', 
      description: 'Product search results' 
    }
  ],

  // Customer account pages (requires login)
  account: [
    { 
      name: 'my-account', 
      path: '/my-account/', 
      description: 'Account dashboard' 
    },
    { 
      name: 'order-history', 
      path: '/my-account/orders/', 
      description: 'Order history' 
    },
    { 
      name: 'downloads', 
      path: '/my-account/downloads/', 
      description: 'Digital downloads' 
    },
    { 
      name: 'addresses', 
      path: '/my-account/edit-address/', 
      description: 'Billing/shipping addresses' 
    },
    { 
      name: 'account-details', 
      path: '/my-account/edit-account/', 
      description: 'Account information' 
    }
  ],

  // Administrative pages
  admin: [
    { 
      name: 'products-admin', 
      path: '/wp-admin/edit.php?post_type=product', 
      description: 'Product management' 
    },
    { 
      name: 'orders-admin', 
      path: '/wp-admin/edit.php?post_type=shop_order', 
      description: 'Order management' 
    },
    { 
      name: 'woo-settings', 
      path: '/wp-admin/admin.php?page=wc-settings', 
      description: 'WooCommerce settings' 
    }
  ],

  // Special pages
  special: [
    { 
      name: 'lost-password', 
      path: '/my-account/lost-password/', 
      description: 'Password reset' 
    },
    { 
      name: 'terms-conditions', 
      path: '/terms-and-conditions/', 
      description: 'Terms and conditions' 
    }
  ]
};