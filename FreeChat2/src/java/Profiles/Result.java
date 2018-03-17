/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;


/**
 *
 * @author EngineeringStudent
 */
public class Result<T> { 
        public Result(Boolean success, String message)
        {
            this.success=success;
            this.message = message;
        }
        public Result(Boolean success, T payload)
        {
            this.success=success;
            this.payload = payload;
        }
        public Result(T payload, Boolean success)
        {
            this.success=success;
            this.payload = payload;
        }
        public Result(Boolean success)
        {
            this.success=success;
        }
        private boolean success;
        private String message;
        private T payload;
        public boolean getSuccess()
        {
            return success;
        }
        public String getMessage()
        {
            return message;
        }
        public T getPayload()
        {
            return payload;
        }
    }