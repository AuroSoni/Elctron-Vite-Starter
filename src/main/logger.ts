import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: 'D:/Electron Projects/electron-starter/error.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: 'D:/Electron Projects/electron-starter/info.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

export default logger
