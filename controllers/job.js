const { NotFoundError, BadRequestError } = require('../errors/index')
const statusCode = require('http-status-codes')

const jobModel = require('../models/job')

const getAllJobs = async (req, res)=>{
    const jobs = await jobModel.find({createdBy: req.user.userId}).sort('-createdAt')
    res.status(statusCode.OK).json({
        jobs
    })
}

const getJob = async (req, res)=>{
    const {
        user: {userId},
        params: {id: jobId},
    } = req

    const job = await jobModel.findOne({ _id: jobId, createdBy: userId})
    if(!job){
        throw new NotFoundError(`job does not exist with this id ${jobId}`)
    }
    res.status(statusCode.OK).json({
        job
    })
}

const createJob = async (req, res)=>{
    req.body.createdBy = req.user.userId
    const job = await jobModel.create(req.body)
    res.status(statusCode.CREATED).json({
        job
    })
}

const updateJob = async (req, res)=>{
    const {
        user: {userId},
        params: {id: jobId},
        body: {company, position}
    } = req

    if(company === "" || position === ""){
        throw new BadRequestError('company or position field cannot be empty')
    }

    if(!await jobModel.findOne({ _id: jobId, createdBy: userId})){
        throw new NotFoundError(`job does not exist with this id ${jobId}`)
    }

    const job = await jobModel.findByIdAndUpdate(
        jobId,
        req.body,
        {runValidators: true, new: true}
    )
    res.status(statusCode.OK).json({
        job
    })
}

const deleteJob = async (req, res)=>{
    const {
        user: { userId },
        params: { id: jobId },
    } = req

    if (!await jobModel.findOne({ _id: jobId, createdBy: userId})) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    const job = await jobModel.findByIdAndRemove(jobId)
    res.status(statusCode.OK).json({
        message: "Deleted Successfully",
        job
    })
}

module.exports = {
    getAllJobs,
    getJob,
    updateJob,
    createJob,
    deleteJob,
}