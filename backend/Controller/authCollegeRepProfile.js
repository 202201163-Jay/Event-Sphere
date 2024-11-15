const express = require('express')
const event=require('../Models/Event')
const CollegeRepModel=require('../Models/CollegeRep')
const college=require('../Models/College')
const eventModel=require('../Models/Event')

exports.getCollegeRepById = async (req, res) => {
    try {
        console.log("Heyyyyyy")
        console.log(req.params.id)

        const collegeRep = await CollegeRepModel.findOne({_id:req.params.id}).populate('collegeId');
        console.log(collegeRep)
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

        console.log("Hhhhhh");
        console.log(req.params.id)
        
        const events=await event.find({createdBy:req.params.id})
        console.log(events)
        if (!events) {
            return res.status(404).json({ error: "Event not",events });
        }
        console.log("Hyeyyy")
        res.status(200).json({events});
    }catch(err){
        res
        .status(500)
        .json({ error: "Failed to retrieve events" });
    }
            
   
};

exports.deleteEvent = async (req, res) => {
    try {
        console.log("Delete karo mitraaaa")
        // const collegeRep = await CollegeRepModel.findOne({_id:req.params.id});
        // const event=await eventModel.findOne({_id:eventid})
        const deletedEvent=await eventModel.deleteOne({_id:req.params.id})

        console.log("Helllooooo")


        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        console.log("Happy")

       

        res
        .status(200)
        .json({ message: "Event deleted successfully" ,res:"ok"});
    } catch (error) {
        res
        .status(500)
        .json({ error: "Failed to delete event" });
    }
};

