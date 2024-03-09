import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";

import UserModel from "../models/user";

const SALT_ROUNDS = 10;

class UsersController {

    public getAllCount = async (req: Request, res: Response): Promise<Response> => {
        try{
            var usersCount = await UserModel.estimatedDocumentCount();
            return res.status(200).json({
                count: usersCount,
            });
        } catch (error) {
            return res.status(500).json({ errors: error });
        }
    }

    public signup = async (req: Request, res: Response): Promise<Response> => {
        const { name, surname, email, password } = req.body;
        // validate request body fields
        if (!name || !surname || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        let user = await UserModel.findOne({ email: email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            const user = new UserModel({
                name,
                surname,
                email,
                password: hashedPassword,
            });

            const newUser = await user.save();
            newUser.password = undefined;

            res.status(201).json({ user: newUser });
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id;
        const { name, surname, email, password } = req.body;

        // validate request params
        if (!id) {
            return res.status(400).json({ message: "Missing id" });
        }

        // validate request body fields
        if (!name || !surname || !email ) {
            return res.status(400).json({ message: "Missing fields" });
        }

        try {
            let user = await UserModel.findById(id);
            if (!user) {
                return res.status(400).json({ message: "User does not exist" });
            }

            user.name = name;
            user.surname = surname;
            user.email = email;
            if (password) {
                const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
                user.password = hashedPassword;
            }
            
            user
                .save()
                .then((user) => {
                    user.password = undefined;
                    console.log(user);
                    res.status(200).json({ user: user });
                })
                .catch((error) => {
                    res.status(500).json({ errors: error });
                });
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    };

    public login = async (req: Request, res: Response): Promise<Response> => {
        const { email, password } = req.body;
        // validate request body fields
        if (!email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }
        let user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
        };

        jwt.sign(
            payload,
           process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN },
            (error, token) => {
                if (error) {
                    return res.status(500).json({ message: error.message });
                }

                res.status(200).json({ token: token });
            }
        );
    };

    public logout = async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).json({ message: "Logout successful" });
    };
}

export { UsersController };
