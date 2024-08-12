package main

import (
	controllers "J2Software/Controllers"
	"J2Software/initializers"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {
	r := gin.Default()
	//r.Use(cors.Default())
	r.POST("/Eventlog", controllers.CreateEventLog)
	r.GET("/Eventlogs", controllers.GetEventLogs)
	r.GET("/Eventlog/:id", controllers.GetEventLog)
	r.PUT("/Eventlog/:id", controllers.UpdateEventLog)
	r.DELETE("/Eventlog/:id", controllers.DeleteEventLog)
	r.GET("/Category", controllers.GetEventLogsMethodNum)
	r.Run()
}
