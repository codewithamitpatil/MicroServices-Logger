const fs = require('fs');
const path = require('path');
const { createLogger,format,transports} = require('winston');
const { File } = transports;
const { combine,label,timestamp,prettyPrint,
colorize,json,simple,errors,printf,splat} = format;


// to control logger
const config ={
  logLevel:process.env.logLevel || "silly",
  logPath:process.env.logPath||"./logs/",
  service:process.env.service || "amit"
}

// ensure log directory exists
fs.existsSync(config.logPath) || fs.mkdirSync(config.logPath)

// production logger
const prodLogger = () => {


// intialize logger
return createLogger({
    level:config.logLevel,
    format: combine(
                    timestamp({format:'YYYY-MM-DD HH:MM:SS'}),
                    errors({stack :true}) ,
                    splat(),
                    simple(),
                    json()
                ),
    defaultMeta: { service: config.service },
    transports: [
     
        // - Write to all logs with level `info` and below to `quick-start-combined.log`.
        // - Write all logs error (and below) to `quick-start-error.log`.
        //
        new File({ filename: path.join(config.logPath, `/${config.service}-error.log`), level: "error" }),
        new File({ filename: path.join(config.logPath, `/${config.service}-warn.log`), level: "warn" }),
        new File({ filename: path.join(config.logPath, `/${config.service}-info.log`), level: "info" }),
        new File({ filename: path.join(config.logPath, `/${config.service}-http.log`), level: "http" }),
        new File({ filename: path.join(config.logPath, `/${config.service}-verbose.log`), level: "verbose" }),
        new File({ filename: path.join(config.logPath, `/${config.service}-debug.log`), level: "debug" }),
        new File({ filename: path.join(config.logPath, `/${config.service}-silly.log`), level: "silly" }),
        new File({ filename: path.join(config.logPath, `/${config.service}-combined.log` )}),
         
                ],
    exceptionHandlers: [ 
        // Write Exception logs
        new File({ filename: path.join(config.logPath, `/${config.service}-Exception.log` )}),
    ],
    exitOnError: false
      
});

}

// development looger
const devLogger = () => {

// log format
const myFormat = printf(({ Function,level,purpose,message, timestamp , stack ,label }) => {
  return `${level}: ${ stack || message} \nService : ${label} \nFunction : ${Function}\nPurpose : ${purpose} \nDate And Time : ${timestamp}  `;
});

// intialize logger
return createLogger({
    level:config.logLevel,
    format:combine(
                    timestamp({format:'YYYY-MM-DD HH:MM:SS'}),
                    errors({stack :true}) ,
                    splat(),
                    simple(),
                    json()
                  ),
    defaultMeta: { service: config.service },
    transports: [
    
      // - Write to all logs with level `info` and below to `quick-start-combined.log`.
      // - Write all logs error (and below) to `quick-start-error.log`.
 
      new transports.Console({ 
          format:combine(
                    label({ label :config.service }),
                    colorize(),
                    myFormat
                 ),
          handleExceptions:true
      }),

      new File({ filename: path.join(config.logPath, `/${config.service}-error.log`), level: "error" }),
      new File({ filename: path.join(config.logPath, `/${config.service}-warn.log`), level: "warn" }),
      new File({ filename: path.join(config.logPath, `/${config.service}-info.log`), level: "info" }),
      new File({ filename: path.join(config.logPath, `/${config.service}-http.log`), level: "http" }),
      new File({ filename: path.join(config.logPath, `/${config.service}-verbose.log`), level: "verbose" }),
      new File({ filename: path.join(config.logPath, `/${config.service}-debug.log`), level: "debug" }),
      new File({ filename: path.join(config.logPath, `/${config.service}-silly.log`), level: "silly" }),
      new File({ filename: path.join(config.logPath, `/${config.service}-combined.log` )}),
   
    ],

    exceptionHandlers: [ 
      // Write Exception logs
      new File({ filename: path.join(config.logPath, `/${config.service}-Exception.log` )}),
    ],

   exitOnError: false
      
});

}

let logger = null;

if (process.env.NODE_ENV !== "production")
{
   logger = devLogger();
}else{
   logger = prodLogger(); 
}

// export logger
module.exports = logger;