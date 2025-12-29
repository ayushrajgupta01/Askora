import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

router.post("/test", async(req,res) => {
    try{
        const thread = new Thread({
            threadId :"pqr",
            title: "testing new thread"
        });

        const response = await thread.save();
        res.send(response); 
    }catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in Db"});
    }
});

router.get("/thread", async(req,res) => {
    try{
        const threads=await Thread.find({}).sort({updatedAt: -1});
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async(req,res) => {
    const {threadId} = req.params;

    try{
        const thread = await Thread.findOne({threadId});

        if(!thread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.send(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async(req,res) => {
    const{threadId} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({succcess: "Thread deleted successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete"});
    }
});

router.post("/chat", async(req,res) => {
    const{threadId, message} = req.body;

    if(!threadId || !message) {
        res.status(400).json({error: "missing required fields"});
    }

    try{
        let thread = await Thread.findOne({threadId});

        if(!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [{role: "user", content: message}]
            });

        } else {
            thread.messages.push({role: "user", content: message});
        }

        const AskoraReply =await getOpenAIAPIResponse(message); 
        thread.messages.push({role:"assistant", content: AskoraReply});
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply: AskoraReply});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});

export default router;