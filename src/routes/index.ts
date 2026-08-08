import express, { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { NoteRoutes } from '../modules/note/note.route';
import { UserRoutes } from '../modules/user/user.route';
import { AdminRoutes } from '../modules/admin/admin.route';

const router = express.Router();

const apiRoutes: { path: string; route: Router }[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/notes',
    route: NoteRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
