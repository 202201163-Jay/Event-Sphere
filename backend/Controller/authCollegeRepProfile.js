const express = require('express')
const event=require('../Models/Event')
const CollegeRepModel=require('../Models/CollegeRep')
const college=require('../Models/College')
const eventModel=require('../Models/Event')

exports.getCollegeRepById = async (req, res) => {
    try {
        const collegeRep = await CollegeRepModel.findOne({_id:req.params.id}).populate('collegeId');
        if (!collegeRep) {
            return res
            .status(404)
            .json({ error: "College representative is not found" });
        }
        res
        .status(200)
        .json(collegeRep);
    } catch (error) {
        res
        .status(500)
        .json({ error: "Failed to retrieve college representative information" });
    }
};


exports.getEvents = async (req, res) => {

    try{
        const events=await event.find({createdBy:req.params.id})
        if (!events) {
            return res.status(404).json({ error: "Event not",events });
        }
        res.status(200).json({events});
    }catch(err){
        res
        .status(500)
        .json({ error: "Failed to retrieve events" });
    }
            
   
};

exports.deleteEvent = async (req, res) => {
    try {

        const deletedEvent=await eventModel.deleteOne({_id:req.params.id})

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        res
        .status(200)
        .json({ message: "Event deleted successfully" ,res:"ok"});
    } catch (error) {
        res
        .status(500)
        .json({ error: "Failed to delete event" });
    }
};

