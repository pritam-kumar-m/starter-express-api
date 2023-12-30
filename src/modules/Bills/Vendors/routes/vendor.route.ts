import { Router } from 'express';
import { vendorCreate ,vendorGet} from '../controllers/vendor.controller';
import { auth } from '../../../../middleware/auth';
const router = Router();

router.post('/add',auth, vendorCreate);
router.get('/get',auth, vendorGet);

export default router;