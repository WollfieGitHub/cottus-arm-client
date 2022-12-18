﻿import {Axis3D} from "./Axis3D";
import {isElementType} from "@testing-library/user-event/dist/utils";
import {Exception} from "sass";
import {constants} from "crypto";

export class Vector3D {
    public static readonly Zero: Vector3D = new Vector3D(0, 0, 0);
    
    public readonly x: number;
    public readonly y: number;
    public readonly z: number;
    
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    public add(that: Vector3D): Vector3D {
        return new Vector3D(
            this.x + that.x,
            this.y + that.y,
            this.z + that.z
        );
    }

    public scale(scalar: number): Vector3D { return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar); }

    public subtract(that: Vector3D): Vector3D { return this.add(that.scale(-1)); }

    public dot(that: Vector3D): number {
        return this.x*that.x + this.y*that.y + this.z*that.z;
    }

    public normSquared(): number {
        return this.dot(this);
    }
    
    public cross(that: Vector3D) {
        return new Vector3D(
            this.y * that.z - this.z * that.y,
            this.z * that.x - this.x * that.z,
            this.x * that.y - this.y * that.x
        );
    }

    public norm() {
        return Math.sqrt(this.normSquared());
    }

    public projectedOnto(normal: Vector3D) {
        return this.dot(normal) / normal.normSquared();
    }

    public normalized(): Vector3D {
        const norm: number = this.norm();
        return new Vector3D(this.x/norm, this.y/norm, this.z/norm);
    }


    rotatedAtOriginAround(axis: number, rotRad: number): Vector3D {
        switch (axis) {
            case 0: return new Vector3D(
                this.x,
                this.y * Math.cos(rotRad) - this.z * Math.sin(rotRad),
                this.y * Math.sin(rotRad) + this.z * Math.cos(rotRad)
            );
            case 1: return new Vector3D(
                this.x * Math.cos(rotRad) + this.z * Math.sin(rotRad),
                this.y,
                -this.x * Math.sin(rotRad) + this.z * Math.cos(rotRad)

            );
            case 2: return new Vector3D(
                this.x * Math.cos(rotRad) - this.y * Math.sin(rotRad),
                this.x * Math.sin(rotRad) + this.y * Math.cos(rotRad),
                this.z
            );
        }
        return Vector3D.Zero;
    }

    rotatedAtPointUsing(eulerAngles: Vector3D, point: Vector3D): Vector3D {
        return this.subtract(point)
            .rotatedAtOriginAround(0, eulerAngles.x)
            .rotatedAtOriginAround(1, eulerAngles.y)
            .rotatedAtOriginAround(2, eulerAngles.z)
            .add(point);
    }
    
    rotatedAtOriginUsing(eulerAngles: Vector3D): Vector3D {
        return this.rotatedAtOriginAround(0, eulerAngles.x)
            .rotatedAtOriginAround(1, eulerAngles.y)
            .rotatedAtOriginAround(2, eulerAngles.z)
    }

    rotatedInverseAtOriginUsing(eulerAngles: Vector3D): Vector3D {
        return this.rotatedAtOriginAround(2, eulerAngles.z)
            .rotatedAtOriginAround(1, eulerAngles.y)
            .rotatedAtOriginAround(0, eulerAngles.x)
    }


    /** @return The angle in radians between {@code this} vector and {@code that} vector */
    angleTo(that: Vector3D): number {
        return Math.acos(this.normalized().dot(that.normalized()));
    }
    
    /** @return Two vectors spanning the plane for which this vector is a normal */
    planeFromNormal(): {v0: Vector3D, v1: Vector3D} {
        let v0: Vector3D;
        
        if (this.z !== 0) {
            // Take the solution of the form (1, 1, z)
            v0 = new Vector3D(1, 1, -(this.x+this.y)/this.z);
        } else if (this.y !== 0) {
            // Take the solution of the form (1, y, 1)
            v0 = new Vector3D(1, -(this.x+this.z)/this.y, 1);
        } else if (this.x !== 0) {
            // Take the solution of the form (x, 1, 1)
            v0 = new Vector3D(-(this.y+this.z)/this.x, 1, 1);
        } else {
            // Infinite of plane solution
            throw new Error("Infinity of Solutions");
        }
        const v1 = v0.cross(this);
        return { v0, v1 };
    }
}