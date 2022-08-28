import { Request, Response } from 'express'
import { read } from 'fs';
import { request } from 'http';
import { allowedNodeEnvironmentFlags } from 'process';
import app from './app'
import connection from './connection';


enum  status {

    TO_DO,
    DOING,
    DONE

}

// GetAllUsers
app.get("/user/all", async (req: Request, res: Response) => {
    try{

        let user = await connection("Users")

        res.status(200).send(user)

        if(!user){
            throw new Error("Don't have users yet");
            
        }

    }catch(error:any){
        res.status(res.statusCode || 500).send({ message: error.message });
    }
})

// CreateUser
app.post("/user", async (req: Request, res: Response) => {
    try {

        await connection("Users").insert({
            name: req.body.name,
            nickname: req.body.nickname,
            email: req.body.email,
            id: Date.now().toString(),
        })

        if(!req.body.name || !req.body.nickname || !req.body.email ){
            throw new Error ("The fields cannot be undefined")
        }
        
        res.status(201).send("User created successfully")

    } catch (error: any) {
        res.status(res.statusCode || 500).send({ message: error.message });
    }
})

// GetUserById
app.get("/user/:id", async (req: Request, res: Response) => {
    try{
        const id = req.params.id
        let user = await connection("Users").where({id: id})


            if (user.length == 0){
                throw new Error ("Didn't find any user with this id")
                
            }

        res.status(200).send(user)

    }catch(error:any){
        res.status(res.statusCode || 500).send({ message: error.message });
    }
})


//ChangeUserById
app.put("/user/edit/:id" , async (req: Request, res:Response) => {
    try {

        const id = req.params.id

        await connection("Users").update({
            name: req.body.name,
            nickname: req.body.nickname

        }).where({id:id})

            if(!req.body.name || !req.body.nickname ){
                throw new Error ("The fields cannot be undefined")
            }

            res.status(200).send("Updated user")

        
    } catch (error:any) {
        res.status(res.statusCode || 500).send({message:error.message})
    }
})


//CreateTask
app.post("/task" , async (req:Request,res:Response) => {
    try {

        const date = 

        await connection("Tasks").insert({
            title: req.body.title,
	        description: req.body.description,
	        limitDate: req.body.limitDate,
	        creatorUserId: req.body.creatorUserId,
            status: status.TO_DO,
            creatorUserNickname: req.body.creatorUserNickname,
            id: Date.now().toString()
        })

        if(!req.body){
            throw new Error("The fields cannot be undefined");
            

        }

        res.status(201).send("Add task")
        
    } catch (error:any) {

        console.log(error)
        res.status(res.statusCode || 500).send({message: error.message})
    }
} )


// GetAllTasks
app.get("/task" , async (req: Request, res: Response) => {
    try {

        const tasks = await connection("Tasks")

        res.status(200).send(tasks)

        
    } catch (error:any) {
        
    }
})

// GetTaskById
app.get("/task/:id" , async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const tasks = await connection("Tasks").where({id:id})

        res.status(200).send(tasks)

        
    } catch (error:any) {
        
    }
})

