
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from "express";
import status from "http-status";


const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(status.NOT_FOUND).json({
      success: false,
      message: "The requested resource was not found on this server.",
      error: ''
    });
  }

  export default notFound