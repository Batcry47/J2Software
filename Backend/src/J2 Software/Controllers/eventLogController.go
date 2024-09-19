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
	var eventlogs []models.EventLogs
	var startDate, endDate time.Time
	var formatError error
	startDateString := c.Query("start_date")
	endDateString := c.Query("end_date")
	dateFormat := "2006-01-02 15:04:05"
	//get eventlog records
	if startDateString != "" {
		startDate, formatError = time.Parse(dateFormat, startDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid Start Date"})
		}
	}

	if endDateString != "" {
		endDate, formatError = time.Parse(dateFormat, endDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid End Date"})
		}
	}

	if startDate.IsZero() && endDate.IsZero() {
		//repsond with the number of Impact alerts
		initializers.DB.Where("Category = ?", "Impact").Find(&eventlogs)
	} else {
		initializers.DB.Where("EventTimeStamp BETWEEN ? AND ? AND Category = ?", startDate, endDate, "Impact").Find(&eventlogs)

	}
	impactCount := len(eventlogs)
	c.JSON(200, gin.H{
		"Impact": impactCount,
	})

}

func GetDefenseEvasionAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs
	var startDate, endDate time.Time
	var formatError error
	startDateString := c.Query("start_date")
	endDateString := c.Query("end_date")
	dateFormat := "2006-01-02 15:04:05"
	if startDateString != "" {
		startDate, formatError = time.Parse(dateFormat, startDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid Start Date"})
		}
	}

	if endDateString != "" {
		endDate, formatError = time.Parse(dateFormat, endDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid End Date"})
		}
	}
	//get eventlog records
	if startDate.IsZero() && endDate.IsZero() {
		//repsond with the number of Defense Evasion alerts
		initializers.DB.Where("Category = ?", "Defense Evasion").Find(&eventlogs)
		defenseEvasionCount := len(eventlogs)
		c.JSON(200, gin.H{
			"DefenseEvasion": defenseEvasionCount,
		})
	} else {
		initializers.DB.Where("EventTimeStamp BETWEEN ? AND ? AND Category = ?", startDate, endDate, "Defense Evasion").Find(&eventlogs)
		defenseEvasionCount := len(eventlogs)
		c.JSON(200, gin.H{
			"DefenseEvasion": defenseEvasionCount,
		})
	}
}

func GetPersistenceAlerts(c *gin.Context) {
	//get eventlog records
	var eventlogs []models.EventLogs
	var startDate, endDate time.Time
	var formatError error
	startDateString := c.Query("start_date")
	endDateString := c.Query("end_date")
	dateFormat := "2006-01-02 15:04:05"
	if startDateString != "" {
		startDate, formatError = time.Parse(dateFormat, startDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid Start Date"})
		}
	}

	if endDateString != "" {
		endDate, formatError = time.Parse(dateFormat, endDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid End Date"})
		}
	}
	if startDate.IsZero() && endDate.IsZero() {
		initializers.DB.Where("Category = ?", "Persistence").Find(&eventlogs)
	} else {
		initializers.DB.Where("EventTimeStamp BETWEEN ? AND ? AND Category = ?", startDate, endDate, "Persistence").Find(&eventlogs)
	}
	//repsond with the number of persistence alerts
	persistenceCount := len(eventlogs)
	c.JSON(200, gin.H{
		"Persistence": persistenceCount,
	})
}

func GetExfiltrationAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	var startDate, endDate time.Time
	var formatError error
	startDateString := c.Query("start_date")
	endDateString := c.Query("end_date")
	dateFormat := "2006-01-02 15:04:05"
	if startDateString != "" {
		startDate, formatError = time.Parse(dateFormat, startDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid Start Date"})
		}
	}

	if endDateString != "" {
		endDate, formatError = time.Parse(dateFormat, endDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid End Date"})
		}
	}
	if startDate.IsZero() && endDate.IsZero() {
		initializers.DB.Where("Category = ?", "Exfiltration").Find(&eventlogs)
	} else {
		initializers.DB.Where("EventTimeStamp BETWEEN ? AND ? AND Category = ?", startDate, endDate, "Exfiltration").Find(&eventlogs)
	}

	exfiltrationCount := len(eventlogs)
	c.JSON(200, gin.H{
		"Exfiltration": exfiltrationCount,
	})
}

func GetInitialAccessAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	var startDate, endDate time.Time
	var formatError error
	startDateString := c.Query("start_date")
	endDateString := c.Query("end_date")
	dateFormat := "2006-01-02 15:04:05"
	if startDateString != "" {
		startDate, formatError = time.Parse(dateFormat, startDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid Start Date"})
		}
	}

	if endDateString != "" {
		endDate, formatError = time.Parse(dateFormat, endDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid End Date"})
		}
	}
	if startDate.IsZero() && endDate.IsZero() {
		initializers.DB.Where("Category = ?", "Initial Access").Find(&eventlogs)
	} else {
		initializers.DB.Where("EventTimeStamp BETWEEN ? AND ? AND Category = ?", startDate, endDate, "Initial Access").Find(&eventlogs)
	}
	initialAccessCount := len(eventlogs)
	c.JSON(200, gin.H{
		"InitialAccess": initialAccessCount,
	})
}

func GetEscalationAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	var startDate, endDate time.Time
	var formatError error
	startDateString := c.Query("start_date")
	endDateString := c.Query("end_date")
	dateFormat := "2006-01-02 15:04:05"
	if startDateString != "" {
		startDate, formatError = time.Parse(dateFormat, startDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid Start Date"})
		}
	}

	if endDateString != "" {
		endDate, formatError = time.Parse(dateFormat, endDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid End Date"})
		}
	}
	if startDate.IsZero() && endDate.IsZero() {
		initializers.DB.Where("Category = ?", "Privilege Escalation").Find(&eventlogs)
	} else {
		initializers.DB.Where("EventTimeStamp BETWEEN ? AND ? AND Category = ?", startDate, endDate, "Privilege Escalation").Find(&eventlogs)
	}
	escalationCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Escalation": escalationCount,
	})
}

func GetCollectionAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	var startDate, endDate time.Time
	var formatError error
	startDateString := c.Query("start_date")
	endDateString := c.Query("end_date")
	dateFormat := "2006-01-02 15:04:05"
	if startDateString != "" {
		startDate, formatError = time.Parse(dateFormat, startDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid Start Date"})
		}
	}

	if endDateString != "" {
		endDate, formatError = time.Parse(dateFormat, endDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid End Date"})
		}
	}

	if startDate.IsZero() && endDate.IsZero() {
		initializers.DB.Where("Category = ?", "Collection").Find(&eventlogs)
	} else {
		initializers.DB.Where("EventTimeStamp BETWEEN ? AND ? AND Category = ?", startDate, endDate, "Collection").Find(&eventlogs)
	}

	collectionCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Collection": collectionCount,
	})
}

func GetReconnaissanceAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	var startDate, endDate time.Time
	var formatError error
	startDateString := c.Query("start_date")
	endDateString := c.Query("end_date")
	dateFormat := "2006-01-02 15:04:05"
	if startDateString != "" {
		startDate, formatError = time.Parse(dateFormat, startDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid Start Date"})
		}
	}

	if endDateString != "" {
		endDate, formatError = time.Parse(dateFormat, endDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid End Date"})
		}
	}
	if startDate.IsZero() && endDate.IsZero() {
		initializers.DB.Where("Category = ?", "Reconnaissance").Find(&eventlogs)
	} else {
		initializers.DB.Where("EventTimeStamp BETWEEN ? AND ? AND Category = ?", startDate, endDate, "Reconnaissance").Find(&eventlogs)
	}
	reconnaissanceCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Reconnaissance": reconnaissanceCount,
	})
}

func GetResourceDevelopmentAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	var startDate, endDate time.Time
	var formatError error
	startDateString := c.Query("start_date")
	endDateString := c.Query("end_date")
	dateFormat := "2006-01-02 15:04:05"

	if startDateString != "" {
		startDate, formatError = time.Parse(dateFormat, startDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid Start Date"})
		}
	}

	if endDateString != "" {
		endDate, formatError = time.Parse(dateFormat, endDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid End Date"})
		}
	}
	if startDate.IsZero() && endDate.IsZero() {
		initializers.DB.Where("Category = ?", "Resource Development").Find(&eventlogs)
	} else {
		initializers.DB.Where("EventTimeStamp BETWEEN ? AND ? AND Category = ?", startDate, endDate, "Resource Development").Find(&eventlogs)
	}

	resourceDevelopmentCount := len(eventlogs)

	c.JSON(200, gin.H{
		"ResourceDevelopment": resourceDevelopmentCount,
	})
}

func GetExecutionAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	var startDate, endDate time.Time
	var formatError error
	startDateString := c.Query("start_date")
	endDateString := c.Query("end_date")
	dateFormat := "2006-01-02 15:04:05"
	if startDateString != "" {
		startDate, formatError = time.Parse(dateFormat, startDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid Start Date"})
		}
	}

	if endDateString != "" {
		endDate, formatError = time.Parse(dateFormat, endDateString)
		if formatError != nil {
			c.JSON(400, gin.H{"error": "Invalid End Date"})
		}
	}
	if startDate.IsZero() && endDate.IsZero() {
		initializers.DB.Where("Category = ?", "Execution").Find(&eventlogs)
	} else {
		initializers.DB.Where("EventTimeStamp BETWEEN ? AND ? AND Category = ?", startDate, endDate, "Execution").Find(&eventlogs)
	}

	executionCount := len(eventlogs)

	c.JSON(200, gin.H{
		"Execution": executionCount,
	})
}

func GetInformationalAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs

	//repsond with the number of persistence alerts
	initializers.DB.Where("Severity = ?", "INFORMATIONAL").Find(&eventlogs)
	informationalAlertCount := len(eventlogs)

	c.JSON(200, gin.H{
		"informationalAlerts": informationalAlertCount,
	})
}

func GetLowAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	//repsond with the number of persistence alerts
	initializers.DB.Where("Severity = ?", "LOW").Find(&eventlogs)
	lowAlertCount := len(eventlogs)

	c.JSON(200, gin.H{
		"lowAlerts": lowAlertCount,
	})
}

func GetMediumAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	//repsond with the number of persistence alerts
	initializers.DB.Where("Severity = ?", "MEDIUM").Find(&eventlogs)
	mediumAlertCount := len(eventlogs)

	c.JSON(200, gin.H{
		"mediumAlerts": mediumAlertCount,
	})
}

func GetHighAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	//repsond with the number of persistence alerts
	initializers.DB.Where("Severity = ?", "HIGH").Find(&eventlogs)
	highAlertCount := len(eventlogs)

	c.JSON(200, gin.H{
		"highAlerts": highAlertCount,
	})
}

func GetCriticalAlerts(c *gin.Context) {
	var eventlogs []models.EventLogs
	//repsond with the number of persistence alerts
	initializers.DB.Where("Severity = ?", "CRITICAL").Find(&eventlogs)
	criticalAlertCount := len(eventlogs)

	c.JSON(200, gin.H{
		"criticalAlerts": criticalAlertCount,
	})
}

func ArchiveEventLog(c *gin.Context) {
	EventID := c.Param("id")

	var eventLog models.EventLogs
	if err := initializers.DB.First(&eventLog, EventID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Event log not found"})
		return
	}

	archivedEventLog := models.ArchivedEventLogs{
		EventID:        eventLog.EventID,
		Category:       eventLog.Category,
		Method:         eventLog.Method,
		Username:       eventLog.Username,
		IPAddress:      eventLog.IPAddress,
		EventTimeStamp: eventLog.EventTimeStamp,
		Severity:       eventLog.Severity,
	}

	tx := initializers.DB.Begin()

	if err := tx.Create(&archivedEventLog).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "Failed to archive event log"})
		return
	}

	if err := tx.Delete(&eventLog).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "Failed to remove event log from active table"})
		return
	}

	tx.Commit()

	c.JSON(200, gin.H{"message": "Event log archived successfully"})
}

func UnarchiveEventLog(c *gin.Context) {
	EventID := c.Param("id")

	var archivedEventLog models.ArchivedEventLogs
	if err := initializers.DB.First(&archivedEventLog, EventID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Archived event log not found"})
		return
	}

	eventLog := models.EventLogs{
		EventID:        archivedEventLog.EventID,
		Category:       archivedEventLog.Category,
		Method:         archivedEventLog.Method,
		Username:       archivedEventLog.Username,
		IPAddress:      archivedEventLog.IPAddress,
		EventTimeStamp: archivedEventLog.EventTimeStamp,
		Severity:       archivedEventLog.Severity,
	}

	tx := initializers.DB.Begin()

	if err := tx.Create(&eventLog).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "Failed to unarchive event log"})
		return
	}

	if err := tx.Delete(&archivedEventLog).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "Failed to remove event log from archive table"})
		return
	}

	tx.Commit()

	c.JSON(200, gin.H{"message": "Event log unarchived successfully"})
}

func GetArchivedEventLogs(c *gin.Context) {
	var archivedEventLogs []models.ArchivedEventLogs
	initializers.DB.Find(&archivedEventLogs)

	c.JSON(200, gin.H{
		"ArchivedEventLogs": archivedEventLogs,
	})
}
