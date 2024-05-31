import Announcement from '../models/announcementModel.js';
import Cap from '../models/capModel.js';
import Opportunity from '../models/opportunityModel.js';
import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Home page controller
export const home = async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.render('index', { 
            title: 'Node Template', 
            announcements, 
            isAuthenticated: req.isAuthenticated() 
        });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Announcement controllers
export const createAnnouncement = async (req, res) => {
  const { announcementName, announcementDetails } = req.body;
  try {
    const newAnnouncement = new Announcement({
      announcementName,
      announcementDetails
    });
    await newAnnouncement.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).send('Internal Server Error');
  }
};


export const editAnnouncement = async (req, res) => {
  try {
    const announcementId = req.params.id;
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).send('Announcement not found');
    }

    res.render('edit', { announcement, title: `Editing ${announcement.announcementName}` });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching announcement' });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcementId = req.params.id;
    const updateData = {
      announcementName: req.body.announcementName,
      announcementDetails: req.body.announcementDetails,
      announcementDate: req.body.announcementDate,
    };

    await Announcement.findOneAndUpdate({ _id: announcementId }, updateData);
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: 'Error updating announcement' });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcementId = req.params.id;
    const deletedAnnouncement = await Announcement.deleteOne({ _id: announcementId });

    if (deletedAnnouncement.deletedCount === 0) {
      console.log('No announcement found with that _id.');
      return res.redirect('/');
    }

    console.log('Deleted announcement');
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Error deleting announcement' });
  }
};

// Static page controllers
export const requirements = async (req, res) => {
    res.render('requirements', { title: 'Requirements', isAuthenticated: req.isAuthenticated() });
};

export const capArchive = async (req, res) => {
    try {
        let query = {};
        if (req.query.category && req.query.category !== '') {
            query.category = req.query.category;
        }

        const caps = await Cap.find(query);
        res.render('cap-archive', { caps, title: 'Service Project Archive', isAuthenticated: req.isAuthenticated() });
    } catch (error) {
        console.error('Error fetching CAP projects:', error);
        res.status(500).send('Internal Server Error');
    }
};



export const getCaps = async (req, res) => {
    const { title, description, author, year, category } = req.body;
    
    let query = {};
    
    try {
        const caps = await Cap.find();
        res.json(caps);
    } catch (error) {
        console.error('Error fetching caps', error);
        res.status(500).send(error);
    }
};

export const createCap = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.render('cap-archive', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('cap-archive', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                try {
                    const { title, description, expandedDescription, author, year, category, contactInfo } = req.body;
                    const newCap = new Cap({
                        title,
                        description,
                        expandedDescription,
                        author,
                        year,
                        category,
                        image: `/uploads/${req.file.filename}`,
                        contactInfo
                    });
                    await newCap.save();
                    res.redirect('/cap-archive');
                } catch (error) {
                    console.error('Error creating CAP project:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        }
    });
};


export const renderNewProjectForm = (req, res) => {
    res.render('new-project-form', { title: 'Add New Project' });
};

export const editCap = async (req, res) => {
    try {
        const capId = req.params.id;
        const cap = await Cap.findById(capId);

        if (!cap) {
            return res.status(404).send('CAP project not found');
        }

        res.render('edit-cap', { cap, title: `Editing ${cap.title}` });
    } catch (error) {
        console.error('Error fetching CAP project:', error);
        res.status(500).json({ error: 'Error fetching CAP project' });
    }
};

export const updateCap = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.render('cap-archive', {
                msg: err
            });
        } else {
            try {
                const capId = req.params.id;
                const { title, description, expandedDescription, author, year, category } = req.body;

                let updateData = { title, description, expandedDescription, author, year, category };
                if (req.file) {
                    updateData.image = `/uploads/${req.file.filename}`;
                }

                await Cap.findByIdAndUpdate(capId, updateData);
                res.redirect('/cap-archive');
            } catch (error) {
                console.error('Error updating CAP project:', error);
                res.status(500).json({ error: 'Error updating CAP project' });
            }
        }
    });
};

export const deleteCap = async (req, res) => {
    try {
        const capId = req.params.id;
        await Cap.findByIdAndDelete(capId);
        res.redirect('/cap-archive');
    } catch (error) {
        console.error('Error deleting CAP project:', error);
        res.status(500).json({ error: 'Error deleting CAP project' });
    }
};

export const opportunities = async (req, res) => {
    try {
        let query = {};
        if (req.query.topic && req.query.topic !== '') {
            query.topic = req.query.topic;
        }
        
        const opportunities = await Opportunity.find(query);
        res.render('opportunities', { opportunities, title: 'Opportunities' });
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Login page controller
export const login = async (req, res) => {
    res.render('login', { title: 'Service Rep Login', isAuthenticated: req.isAuthenticated() });
};

// Ensure capDetails is defined
export const capDetails = async (req, res) => {
    try {
        const cap = await Cap.findById(req.params.id);
        if (!cap) {
            return res.status(404).send('CAP project not found');
        }
        res.render('cap-details', { cap, title: cap.title });
    } catch (error) {
        console.error('Error fetching CAP project:', error);
        res.status(500).json({ error: 'Error fetching CAP project' });
    }
};
