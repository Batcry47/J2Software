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
	initializers.DB.Where("Severity = ?", Severity).Find(&eventlogs)
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

func GetImpactAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of Impact alerts
	initializers.DB.Where("Category = ?", "Impact").Find(&eventlogs)
	impactCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Impact": impactCount,
	})
}

func GetDefenseEvasionAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of Defense Evasion alerts
	initializers.DB.Where("Category = ?", "Defense Evasion").Find(&eventlogs)
	defenseEvasionCount := len(eventlogs)

	c.JSON(200, gin.H{
		"DefenseEvasion": defenseEvasionCount,
	})
}

func GetPersistenceAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Persistence").Find(&eventlogs)
	persistenceCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Persistence": persistenceCount,
	})
}

func GetExfiltrationAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Exfiltration").Find(&eventlogs)
	exfiltrationCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Exfiltration": exfiltrationCount,
	})
}

func GetInitialAccessAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Initial Access").Find(&eventlogs)
	initialAccessCount := len(eventlogs)

	c.JSON(200, gin.H{
		"InitialAccess": initialAccessCount,
	})
}

func GetEscalationAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Escalation").Find(&eventlogs)
	escalationCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Escalation": escalationCount,
	})
}

func GetCollectionAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Collection").Find(&eventlogs)
	collectionCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Collection": collectionCount,
	})
}

func GetReconnaissanceAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Reconnaissance").Find(&eventlogs)
	reconnaissanceCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Reconnaissance": reconnaissanceCount,
	})
}

func GetResourceDevelopmentAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Resource Development").Find(&eventlogs)
	resourceDevelopmentCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Resource Development": resourceDevelopmentCount,
	})
}

func GetExecutionAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Category = ?", "Execution").Find(&eventlogs)
	executionCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Execution": executionCount,
	})
}
