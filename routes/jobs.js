const express = require('express')

const jobs = require('../controllers/job')

const router = express.Router()

router.route('/')
    .get(jobs.getAllJobs)
    .post(jobs.createJob)

router.route('/:id')
    .get(jobs.getJob)
    .patch(jobs.updateJob)
    .delete(jobs.deleteJob)

module.exports = router


