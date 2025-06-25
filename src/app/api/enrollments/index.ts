export interface Enrollment {
  id: number;
  userId: string;
  courseId: number;
  status: string;
  course?: Course;
  user?: User;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: string;
  trainerId: string;
  trainer?: User;
  enrollments?: Enrollment[];
}

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}
