process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../app";
import { Exercise } from "../models";

require("./setup");

