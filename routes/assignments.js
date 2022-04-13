let Assignment = require('../models/assignment.model');

// Récupérer tous les assignments (GET)
//sans la pagination.....
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/

// Récupérer tous les assignments (GET)




module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };