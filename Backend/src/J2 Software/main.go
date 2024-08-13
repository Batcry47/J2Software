package main

import (
	controllers "J2Software/Controllers"
	"J2Software/initializers"

	"github.com/gin-gonic/gin"
	"net/http"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {
	r := gin.Default()

    // Middleware to set CORS headers
    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(http.StatusNoContent)
            return
        }

        c.Next()
    })

	r.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "this route loads",
        })
    })
	//r.Use(cors.Default())
	r.POST("/Eventlog", controllers.CreateEventLog)
	r.GET("/Eventlogs", controllers.GetEventLogs)
	r.GET("/Eventlog/:id", controllers.GetEventLog)
	r.PUT("/Eventlog/:id", controllers.UpdateEventLog)
	r.DELETE("/Eventlog/:id", controllers.DeleteEventLog)
	r.GET("/SeverityCount/:Severity", controllers.GetEventLogsSeverityNum)
	r.Run()
}
