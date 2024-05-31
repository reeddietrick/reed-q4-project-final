import express from 'express';
import * as ctrl from '../controllers/mainController.js';
import * as auth from '../controllers/authController.js';

const router = express.Router();

router.get('/login', auth.login);
router.post('/login', auth.verifyLogin);
router.get('/logout', auth.logout);

router.get('/', ctrl.home);

router.post('/announcements/create', auth.isAuthenticated, ctrl.createAnnouncement);
router.get('/edit-announcement/:id', auth.isAuthenticated, ctrl.editAnnouncement);
router.post('/update-announcement/:id', auth.isAuthenticated, ctrl.updateAnnouncement);
router.get('/delete-announcement/:id', auth.isAuthenticated, ctrl.deleteAnnouncement);

router.get('/cap-archive', ctrl.capArchive);
router.get('/new', auth.isAuthenticated, ctrl.renderNewProjectForm);

router.get('/edit-cap/:id', auth.isAuthenticated, ctrl.editCap);
router.post('/edit-cap/:id', auth.isAuthenticated, ctrl.updateCap);
router.post('/update-cap/:id', auth.isAuthenticated, ctrl.updateCap);
router.post('/delete-cap/:id', auth.isAuthenticated, ctrl.deleteCap);

router.get('/requirements', ctrl.requirements);
router.get('/opportunities', ctrl.opportunities);
router.post('/api/caps', ctrl.getCaps);
router.post('/create-cap', auth.isAuthenticated, ctrl.createCap);

router.get('/cap/:id', ctrl.capDetails);

export default router;
