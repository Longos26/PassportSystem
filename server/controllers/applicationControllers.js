const Application = require('../models/Application');


module.exports = {
createApplication: async function(req, res) {
    try {
        const newApplication = new Application(req.body);
        await newApplication.save();
        res.status(201).send(newApplication);
    } catch (error) {
        res.status(400).send(error);
    }
},
    
    getApplications: async function(_req, res) {
        try {
            const applications = await Application.find();
            res.status(200).send(applications);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    getApplicationById: async function(req, res) {
        try {
            const application = await Application.findById(req.params.id);
            if (application) {
                res.status(200).send(application);
            } else {
                res.status(404).send('Application not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },
    updateApplication: async function(req, res) {
        try {
            const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (application) {
                res.status(200).send(application);
            } else {
                res.status(404).send('Application not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },
    deleteApplication: async function(req, res) {
        try {
            const application = await Application.findByIdAndDelete(req.params.id);
            if (application) {
                res.status(204).send();
            } else {
                res.status(404).send('Application not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },
    submitApplication: async function(req, res) {
        try {
            const application = await Application.findById(req.params.id);
            if (application) {
                application.status = 'Submitted';
                await application.save();
                res.status(200).send(application);
            } else {
                res.status(404).send('Application not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },
    getApplicationStatus: async function(req, res) {
        try {
            const application = await Application.findById(req.params.id);
            if (application) {
                res.status(200).send({ status: application.status });
            } else {
                res.status(404).send('Application not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },
    addApplicationNote: async function(req, res) {
        try {
            const application = await Application.findById(req.params.id);
            if (application) {
                if (!application.notes) {
                    application.notes = [];
                }
                application.notes.push(req.body.note);
                await application.save();
                res.status(200).send(application);
            } else {
                res.status(404).send('Application not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },
    requestAdditionalInfo: async function(req, res) {
        try {
            const application = await Application.findById(req.params.id);
            if (application) {
                application.status = 'Additional Info Requested';
                await application.save();
                res.status(200).send(application);
            } else {
                res.status(404).send('Application not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }
};
