let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser')

let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/centralAccess');
let db = mongoose.connection;

let Data = require('../models/requester');
let thirdParty = require('../models/thirdParty');
let location = require('../models/locationChange');
let damage = require('../models/damage');
let lost = require('../models/lostCard');
let approver = require('../models/approverData');

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}))

//get new access data
router.get('/findemployee', function(req, res, next) {
    Data.find({}, function(err, data) {
        res.json(data);
    });
});

router.get('/findemployeebyid/:id', function(req, res, next) {
    Data.findOne({employeeID: req.params.id}, function(err, data) {
        res.json(data);
    });
});

//get third party data
router.get('/findthird', function(req, res, next) {
    thirdParty.find({}, function(err, data) {
        res.json(data);
    });
});

//get location change data
router.get('/findlocation', function(req, res, next) {
    location.find({}, function(err, data) {
        res.json(data);
    });
});

//get damage data
router.get('/finddamage', function(req, res, next) {
    damage.find({}, function(err, data) {
        res.json(data);
    });
});

//get lost data
router.get('/findlost', function(req, res, next) {
    lost.find({}, function(err, data) {
        res.json(data);
    });
});


//Get Approver Data fom Database (Excel Wala)
router.get('/find', function(req, res, next) {
    approver.find({}, function(err, data) {
        res.json(data);
    });
});

router.put('/update/:employeeID', (req, res) => {
Data.update({
    employeeID: req.params.employeeID
}, { $set:
    {zone : req.body.zone,
        accessType: req.body.accessType,
        prev: req.body.prev,
        current: req.body.current,
         issuedBy: req.body.issued,
      issueDate: req.body.datepickerModel,
      cardno: req.body.accessCard
    }},
    {upsert: true},
    (err, empp) => {
        if(err)
            throw err
        else
        {
            res.json(empp)
        }
})
})

router.post('/employee', function(req, res, next) {

    approver.create(req.body).then(function(data) {

        res.send(data)


    })
})

router.post('/insert', function(req, res, next) {
    Data.create(req.body).then(function(data) {
        res.send(data)
    })

})

router.get('/show', function(req, res, next) {
    Data.find({}, function(err, data) {
        res.json(data);
    });
})

//api for third party
router.post('/thirdInsert', function(req, res, next) {

    thirdParty.create(req.body).then(function(data) {

        res.send(data)


    })

})
//api for Location change
router.post('/locationInsert', function(req, res, next) {
    location.create(req.body).then(function(data) {
        res.send(data)
    })
})

//api for lost card
router.post('/lostInsert', function(req, res, next) {
    lost.create(req.body).then(function(data) {
        res.send(data);
    })

})

//api for damged card
router.post('/damageInsert', function(req, res, next){
    damage.create(req.body).then(function(data) {
        res.send(data);
    })

})

module.exports = router;