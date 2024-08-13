package Controllers

import (
	"J2Software/initializers"
	"J2Software/models"
	"time"

	"github.com/gin-gonic/gin"
)

// used to create an event log using the go api
// not used right now but may be neccessary in the future since this is a fully functional crud API
func CreateEventLog(c *gin.Context) {

	//get data off event (request) body
	var event struct {
		EventID        uint
		Category       string
		Method         string
		Username       string
		IPAddress      string
		EventTimeStamp time.Time
		Severity       string
	}
	c.Bind(&event)

	//create an alert:
	eventlog := models.EventLogs{EventID: event.EventID, Category: event.Category, Method: event.Method,
		Username: event.Username, IPAddress: event.IPAddress, EventTimeStamp: event.EventTimeStamp, Severity: event.Severity}

	result := initializers.DB.Create(&eventlog)

	if result.Error != nil {
		c.Status(400)
		return
	}

	//return it
	c.JSON(200, gin.H{
		"Eventlog": eventlog,
	})
}

// used to get all event logs in the database
func GetEventLogs(c *gin.Context) {

	//get the alerts and store them in a slice of type models.EventLogs
	var eventlogs []models.EventLogs

	//respond with those alerts
	//initializers.DB.First(&user) //Getting a log
	initializers.DB.Find(&eventlogs)

	c.JSON(200, gin.H{
		"Eventlogs": eventlogs,
	})
	
}

// used to get a single event log accroding to it's event id
func GetEventLog(c *gin.Context) {
	//get id off url
	EventID := c.Param("id")

	//get the alerts and store them in a slice of type models.EventLogs
	var eventlog models.EventLogs

	//respond with those alerts
	initializers.DB.First(&eventlog, EventID)

	c.JSON(200, gin.H{
		"Eventlog": eventlog,
	})
}

func UpdateEventLog(c *gin.Context) {
	//get the id off of the url
	EventID := c.Param("id")

	//get the data off the eventlog body
	var event struct {
		EventID        uint
		Category       string
		Method         string
		Username       string
		IPAddress      string
		EventTimeStamp time.Time
		Severity       string
	}
	c.Bind(&event)

	//find the eventlog we're updating
	var eventlog models.EventLogs
	initializers.DB.First(&eventlog, EventID)

	//update the eventlog
	initializers.DB.Model(&eventlog).Updates(models.EventLogs{
		EventID:        event.EventID,
		Category:       event.Category,
		Method:         event.Method,
		Username:       event.Username,
		IPAddress:      event.IPAddress,
		EventTimeStamp: event.EventTimeStamp,
		Severity:       event.Severity,
	})

	//respond with the eventlog
	c.JSON(200, gin.H{
		"Eventlog": eventlog,
	})
}

func DeleteEventLog(c *gin.Context) {
	//get the id off the url
	EventID := c.Param("id")

	//delete the eventlog
	initializers.DB.Delete(&models.EventLogs{}, EventID)

	//respond
	c.Status(200)
}

func GetEventLogsSeverityNum(c *gin.Context) {
	//get event severity
	Severity := c.Param("Severity")

	//get eventlog records
	var eventlogs []models.EventLogs

	//respond with severity number
	initializers.DB.Where("Severity <> ?", Severity).Find(&eventlogs)
	severityNum := len(eventlogs)

	c.JSON(200, gin.H{
		"SeverityCount": severityNum,
	})
}

func GetCategoryCount(c *gin.Context) {
	//get event category
	Category := c.Param("Category")

	//get eventlog records
	var eventlogs []models.EventLogs

	//respond with category number
	initializers.DB.Where("Category <> ?", Category).Find(&eventlogs)
	categoryCount := len(eventlogs)

	c.JSON(200, gin.H{
		"CategoryCount": categoryCount,
	})
}
