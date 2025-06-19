// config/learndash-pages.js
// LearnDash LMS specific page configurations

module.exports = {
  // Course browsing and overview
  courses: [
    { 
      name: 'courses-archive', 
      path: '/courses/', 
      description: 'All courses listing' 
    },
    { 
      name: 'course-single', 
      path: '/courses/test-course/', 
      description: 'Course overview page' 
    },
    { 
      name: 'lesson-single', 
      path: '/lessons/test-lesson/', 
      description: 'Individual lesson' 
    },
    { 
      name: 'topic-single', 
      path: '/topic/test-topic/', 
      description: 'Lesson topic' 
    },
    { 
      name: 'quiz-single', 
      path: '/quiz/test-quiz/', 
      description: 'Quiz interface' 
    },
    { 
      name: 'assignment-upload', 
      path: '/assignment/test-assignment/', 
      description: 'Assignment submission' 
    }
  ],

  // Student dashboard and progress
  student: [
    { 
      name: 'profile-courses', 
      path: '/profile/?tab=courses', 
      description: 'Student course progress' 
    },
    { 
      name: 'profile-quizzes', 
      path: '/profile/?tab=quizzes', 
      description: 'Quiz results' 
    },
    { 
      name: 'profile-assignments', 
      path: '/profile/?tab=assignments', 
      description: 'Assignment submissions' 
    },
    { 
      name: 'profile-certificates', 
      path: '/profile/?tab=certificates', 
      description: 'Earned certificates' 
    },
    { 
      name: 'course-progress', 
      path: '/course-progress/', 
      description: 'Detailed progress tracking' 
    }
  ],

  // Instructor and admin features
  instructor: [
    { 
      name: 'course-builder', 
      path: '/wp-admin/post.php?post=123&action=edit', 
      description: 'Course creation interface' 
    },
    { 
      name: 'quiz-builder', 
      path: '/wp-admin/admin.php?page=ldAdvQuiz', 
      description: 'Quiz creation' 
    },
    { 
      name: 'gradebook', 
      path: '/wp-admin/admin.php?page=learndash-lms-reports', 
      description: 'Student grades and reports' 
    }
  ],

  // Certificates and completion
  completion: [
    { 
      name: 'certificate-view', 
      path: '/certificates/test-certificate/', 
      description: 'Certificate display' 
    },
    { 
      name: 'course-complete', 
      path: '/courses/test-course/?complete', 
      description: 'Course completion page' 
    }
  ]
};