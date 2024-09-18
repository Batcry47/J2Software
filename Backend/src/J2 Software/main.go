package main

import (
	controllers "J2Software/Controllers"
	"J2Software/initializers"

	"net/http"

	"github.com/gin-gonic/gin"
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
	r.GET("/Impact/:Category?start_date=2020-01-01&end_date=2020-12-01", controllers.GetImpactAlerts)
	r.GET("/Collection/:Category?start_date=2020-01-01&end_date=2020-12-01", controllers.GetCollectionAlerts)
	r.GET("/DefenseEvasion/:Category?start_date=2020-01-01&end_date=2020-12-01", controllers.GetDefenseEvasionAlerts)
	r.GET("/Persistence/:Category?start_date=2020-01-01&end_date=2020-12-01", controllers.GetPersistenceAlerts)
	r.GET("/Exfiltration/:Category?start_date=2020-01-01&end_date=2020-12-01", controllers.GetExfiltrationAlerts)
	r.GET("/InitialAccess/:Category?start_date=2020-01-01&end_date=2020-12-01", controllers.GetInitialAccessAlerts)
	r.GET("/PrivilegeEscalation/:Category?start_date=2020-01-01&end_date=2020-12-01", controllers.GetEscalationAlerts)
	r.GET("/Reconnaissance/:Category?start_date=2020-01-01&end_date=2020-12-01", controllers.GetReconnaissanceAlerts)
	r.GET("/ResourceDevelopment/:Category?start_date=2020-01-01&end_date=2020-12-01", controllers.GetResourceDevelopmentAlerts)
	r.GET("/Execution/:Category?start_date=2020-01-01&end_date=2020-12-01", controllers.GetExecutionAlerts)
	r.GET("/Informational/:Severity", controllers.GetInformationalAlerts)
	r.GET("/Low/:Severity", controllers.GetLowAlerts)
	r.GET("/Medium/:Severity", controllers.GetMediumAlerts)
	r.GET("/High/:Severity", controllers.GetHighAlerts)
	r.GET("/Critical/:Severity", controllers.GetCriticalAlerts)
	r.POST("/login", controllers.Login)

	r.Run()
}
