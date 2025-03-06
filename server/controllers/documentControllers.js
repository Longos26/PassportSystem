const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

module.exports = {
    uploadDocument: async (req, res) => {
        try {
            // Ensure we have the file
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Create a new document using the file uploaded and user info
            const newDocument = new Document({
                user: req.user.id,
                application: req.body.application || null,
                documentType: req.body.documentType || 'other',
                documentName: req.file.originalname,
                fileType: path.extname(req.file.originalname).substring(1),
                filePath: req.file.path,
                fileSize: req.file.size,
                uploadDate: Date.now(),
                verificationStatus: 'pending'
            });
            
            // Save the document
            const savedDocument = await newDocument.save();
            res.status(201).json(savedDocument);
        } catch (error) {
            console.error('Error uploading document:', error);
            res.status(500).json({ message: 'Error uploading document' });
        }
    },
    
    getDocuments: async (req, res) => {
        try {
            // Get all documents for the user
            const documents = await Document.find({ user: req.user.id });
            res.status(200).json(documents);
        } catch (error) {
            console.error('Error fetching documents:', error);
            res.status(500).json({ message: 'Error fetching documents' });
        }
    },
    
    getDocumentById: async (req, res) => {
        try {
            const document = await Document.findById(req.params.id);
            
            if (!document) {
                return res.status(404).json({ message: 'Document not found' });
            }
            
            // Check if the user is authorized to view this document
            if (document.user.toString() !== req.user.id && 
                !['admin', 'officer'].includes(req.user.role)) {
                return res.status(403).json({ message: 'Not authorized to access this document' });
            }
            
            res.status(200).json(document);
        } catch (error) {
            console.error('Error fetching document:', error);
            res.status(500).json({ message: 'Error fetching document' });
        }
    },
    
    deleteDocument: async (req, res) => {
        try {
            const document = await Document.findById(req.params.id);
            
            if (!document) {
                return res.status(404).json({ message: 'Document not found' });
            }
            
            // Check if the user is authorized to delete this document
            if (document.user.toString() !== req.user.id && 
                !['admin', 'officer'].includes(req.user.role)) {
                return res.status(403).json({ message: 'Not authorized to delete this document' });
            }
            
            // Delete the file from the file system
            if (document.filePath && fs.existsSync(document.filePath)) {
                fs.unlinkSync(document.filePath);
            }
            
            await Document.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Document deleted successfully' });
        } catch (error) {
            console.error('Error deleting document:', error);
            res.status(500).json({ message: 'Error deleting document' });
        }
    },
    
    verifyDocument: async (req, res) => {
        try {
            const document = await Document.findById(req.params.id);
            
            if (!document) {
                return res.status(404).json({ message: 'Document not found' });
            }
            
            document.verificationStatus = 'verified';
            document.verifiedBy = req.user.id;
            document.verificationDate = Date.now();
            document.verificationNotes = req.body.notes || '';
            
            const updatedDocument = await document.save();
            res.status(200).json(updatedDocument);
        } catch (error) {
            console.error('Error verifying document:', error);
            res.status(500).json({ message: 'Error verifying document' });
        }
    },
    
    rejectDocument: async (req, res) => {
        try {
            const document = await Document.findById(req.params.id);
            
            if (!document) {
                return res.status(404).json({ message: 'Document not found' });
            }
            
            document.verificationStatus = 'rejected';
            document.verifiedBy = req.user.id;
            document.verificationDate = Date.now();
            document.verificationNotes = req.body.reason || 'No reason provided';
            
            const updatedDocument = await document.save();
            res.status(200).json(updatedDocument);
        } catch (error) {
            console.error('Error rejecting document:', error);
            res.status(500).json({ message: 'Error rejecting document' });
        }
    }
};