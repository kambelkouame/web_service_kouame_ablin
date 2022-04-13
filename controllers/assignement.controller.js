//import 
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Assignment = mongoose.model('Assignment');


module.exports.getAssignments = async(req, res, next) => {
    var aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(aggregateQuery, {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, assignments) => {
            if (err) {
                res.send(err);
            }
            res.send(assignments);
        }
    );
}

// Récupérer un assignment par son id (GET)
module.exports.getAssignment = async(req, res, next) => {
    let assignmentId = req.params.id;

    Assignment.findOne({ id: assignmentId }, (err, assignment) => {
        if (err) { res.send(err) }
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
module.exports.postAssignment = async(req, res, next) => {
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save((err) => {
        if (err) {
            res.send('impossible de faire le post ', err);
        }
        res.json({ message: `${assignment.nom} ajouté avec succès par la back-end!` })
    })
}

// Update d'un assignment (PUT)
module.exports.updateAssignment = async(req, res, next) => {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: `${assignment.nom} updated!` })
        }

        // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
module.exports.deleteAssignment = async(req, res, next) => {


    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${assignment.nom} deleted` });
    })


}