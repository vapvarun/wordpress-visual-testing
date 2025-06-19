// config/buddypress-pages.js
// BuddyPress specific page configurations

module.exports = {
  // Public pages (no login required)
  public: [
    { 
      name: 'homepage', 
      path: '/', 
      description: 'Site homepage' 
    },
    { 
      name: 'activity-stream', 
      path: '/activity/', 
      description: 'Public activity feed' 
    },
    { 
      name: 'members-directory', 
      path: '/members/', 
      description: 'Browse all members' 
    },
    { 
      name: 'groups-directory', 
      path: '/groups/', 
      description: 'Browse all groups' 
    },
    { 
      name: 'register', 
      path: '/register/', 
      description: 'User registration page' 
    }
  ],

  // User profile and account pages (requires login)
  authenticated: [
    { 
      name: 'my-profile', 
      path: '/members/admin/', 
      description: 'User profile home' 
    },
    { 
      name: 'edit-profile', 
      path: '/members/admin/profile/edit/', 
      description: 'Edit profile information' 
    },
    { 
      name: 'change-avatar', 
      path: '/members/admin/profile/change-avatar/', 
      description: 'Upload/change avatar' 
    },
    { 
      name: 'account-settings', 
      path: '/members/admin/settings/', 
      description: 'Account settings' 
    },
    { 
      name: 'notifications', 
      path: '/members/admin/notifications/', 
      description: 'Notification center' 
    },
    { 
      name: 'friend-requests', 
      path: '/members/admin/friends/requests/', 
      description: 'Pending friend requests' 
    },
    { 
      name: 'my-friends', 
      path: '/members/admin/friends/', 
      description: 'Friends list' 
    }
  ],

  // Private messaging system
  messaging: [
    { 
      name: 'messages-inbox', 
      path: '/members/admin/messages/', 
      description: 'Message inbox' 
    },
    { 
      name: 'compose-message', 
      path: '/members/admin/messages/compose/', 
      description: 'Send new message' 
    },
    { 
      name: 'sent-messages', 
      path: '/members/admin/messages/sentbox/', 
      description: 'Sent messages' 
    }
  ],

  // Group functionality
  groups: [
    { 
      name: 'create-group', 
      path: '/groups/create/', 
      description: 'Create new group' 
    },
    { 
      name: 'group-home', 
      path: '/groups/test-group/', 
      description: 'Group homepage' 
    },
    { 
      name: 'group-members', 
      path: '/groups/test-group/members/', 
      description: 'Group member list' 
    },
    { 
      name: 'group-activity', 
      path: '/groups/test-group/activity/', 
      description: 'Group activity feed' 
    },
    { 
      name: 'group-forum', 
      path: '/groups/test-group/forum/', 
      description: 'Group discussion forum' 
    },
    { 
      name: 'group-invite', 
      path: '/groups/test-group/send-invites/', 
      description: 'Invite members to group' 
    }
  ],

  // Activity feed variations
  activity: [
    { 
      name: 'activity-mentions', 
      path: '/activity/mentions/', 
      description: 'Activity mentions' 
    },
    { 
      name: 'activity-favorites', 
      path: '/activity/favorites/', 
      description: 'Favorited activities' 
    },
    { 
      name: 'activity-friends', 
      path: '/activity/friends/', 
      description: 'Friends activities only' 
    },
    { 
      name: 'activity-groups', 
      path: '/activity/groups/', 
      description: 'Group activities only' 
    }
  ]
};