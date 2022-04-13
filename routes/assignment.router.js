const express = require('express');
const router = express.Router();
const { role } = require('../middlewares/role');
const { deleteAssignment, getAssignment, getAssignments, postAssignment, updateAssignment } = require('../controllers/assignement.controller');


router.post('/assignments', postAssignment);
router.get('/assignments', getAssignments);
router.put('/assignments', updateAssignment);

router.get('/assignments/:id', getAssignment);
router.delete('/assignments/:id', deleteAssignment);


module.exports = router;